// CharacterCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { likeCharacter } from '@/slices/charactersSlice';
import Button from '@/components/common/Button';
import { initializeCharacterChatState } from '@/slices/chatSlice';
import Config from '@/constants/Config';
import Colors from '@/constants/Colors';
import { Image } from 'expo-image';
import Sizes from '@/constants/Sizes';

interface CharacterProps {
  character: Character;
}

const CharacterCard: React.FC<CharacterProps> = ({ character }) => {
  const dispatch = useDispatch();
  console.log(character.avatar_url);

  return (
    <View style={styles.characterCard}>
      <View style={styles.section}>
        <Image
          // TODO: manifestement les images fetchées ne sont pas celles en local
          source={{ uri: character.avatar_url }}
          style={styles.profilePhoto}
          contentFit="cover"
        />
        <Text style={styles.characterName}>
          {character.name} {character.surname}
        </Text>
        {Boolean(character.birth) && (
          <Text style={styles.characterDescription}>{character.birth}</Text>
        )}
      </View>
      {character.profile?.map((profileSection, index) =>
        renderProfileSection(profileSection, index)
      )}
      <View style={[styles.section, styles.buttonsContainer]}>
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
    </View>
  );
};

const renderProfileSection = (
  profileSection: CharacterProfileSection,
  index: number
) => {
  // Préparation du titre
  const titleElement = profileSection.profile_prompt_title?.data?.attributes
    ?.title != null && (
    <Text
      key={index + '-title'}
      style={[styles.sectionPromptTitle, styles.characterDescription]}
    >
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
          style={styles.profilePhoto}
        />
      );
      break;
    case 'profile.text-prompt':
      content = (
        <Text
          key={index + '-answer'}
          style={[styles.textSection, styles.characterDescription]}
        >
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
    <View style={styles.section} key={index}>
      {titleElement}
      {content}
    </View>
  );
};

const styles = StyleSheet.create({
  characterCard: {
    flex: 1,
    gap: Sizes.padding,
  },
  profilePhoto: {
    flex: 1,
    width: '100%',
    // TODO: auto aspect-ratio
    aspectRatio: 1,
    backgroundColor: Colors.grey,
  },
  section: {
    borderRadius: Sizes.borderRadius,
    backgroundColor: Colors.white,
  },
  sectionPromptTitle: {
    // TODO: pas pris en compte
    fontSize: Sizes.subtitleFontSize,
    margin: Sizes.padding,
    marginBottom: 0,
  },
  textSection: {
    padding: Sizes.padding,
  },
  characterName: {
    fontSize: Sizes.subtitleFontSize,
    fontWeight: 'bold',
  },
  characterDescription: {
    fontSize: Sizes.regularFontSize,
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: Sizes.padding * 2,
  },
  button: {
    flex: 1,
  },
});

export default CharacterCard;
