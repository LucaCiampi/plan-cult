// CharacterCard.tsx
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useDispatch } from 'react-redux';
import { likeCharacter } from './charactersSlice';
import Button from '@/components/common/Button';
import { initializeCharacterChatState } from '../chat/chatSlice';
import Config from '@/constants/Config';

interface CharacterProps {
  character: Character;
}

const CharacterCard: React.FC<CharacterProps> = ({ character }) => {
  const dispatch = useDispatch();

  return (
    <>
      <Image
        // TODO: manifestement les images fetchées ne sont pas celles en local
        source={{ uri: character.avatar_url }}
        style={{ width: 100, height: 100 }}
      />
      <Text style={styles.characterName}>
        {character.name} {character.surname}
      </Text>
      {Boolean(character.birth) && (
        <Text style={styles.characterDescription}>{character.birth}</Text>
      )}
      {character.profile?.map((profileSection, index) =>
        renderProfileSection(
          profileSection as CharacterProfileSection,
          index as number
        )
      )}
      <View style={styles.buttonsContainer}>
        <Button
          style={styles.button}
          onPress={() => {
            console.log(`${character.name} disliked, no effect`);
          }}
        >
          Dislike
        </Button>
        <Button
          style={styles.button}
          onPress={() => {
            dispatch(likeCharacter(character.id));
            const initialChatState = {
              conversation: [],
              currentQuestions: [],
              previousQuestions: [],
            };
            const characterId = character.id.toString();
            dispatch(
              initializeCharacterChatState({ characterId, initialChatState })
            );
          }}
        >
          Like
        </Button>
      </View>
    </>
  );
};

const renderProfileSection = (
  profileSection: CharacterProfileSection,
  index: number
) => {
  // Préparation du titre
  const titleElement = profileSection.profile_prompt_title?.data?.attributes
    ?.title != null && (
    <Text key={index + '-title'} style={styles.characterDescription}>
      {profileSection.profile_prompt_title.data.attributes.title}
    </Text>
  );

  // Génération du contenu spécifique basé sur le __component
  let content;
  switch (profileSection.__component) {
    case 'profile.photo':
      content = (
        <Image
          key={index}
          source={{
            uri:
              Config.STRAPI_DOMAIN_URL +
              profileSection.image?.data?.attributes?.url,
          }}
          style={{ width: 100, height: 100 }}
        />
      );
      break;
    case 'profile.text-prompt':
      content = (
        <Text key={index + '-answer'} style={styles.characterDescription}>
          {profileSection.answer?.map((answer, answerIndex) =>
            answer.children.map((answerChild, childIndex) =>
              answerChild.children.map((answerChildChild, childChildIndex) => (
                <Text
                  key={`${index}-${answerIndex}-${childIndex}-${childChildIndex}`}
                >
                  {answerChildChild.text}
                </Text>
              ))
            )
          )}
        </Text>
      );
      break;
    // Ajoute d'autres cas ici selon les types de __component que tu as
    default:
      content = null;
  }

  // Retourne le titre (si présent) et le contenu spécifique
  return (
    <View key={index} style={styles.characterProfileSection}>
      {titleElement}
      {content}
    </View>
  );
};

const styles = StyleSheet.create({
  characterName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  characterDescription: {
    fontSize: 14,
  },
  characterProfileSection: {
    borderBottomColor: '#222',
    borderBottomWidth: 1,
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 24,
  },
  button: {
    flex: 1,
  },
});

export default CharacterCard;
