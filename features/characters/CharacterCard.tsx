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

  // Fonction pour le rendu conditionnel basé sur __component
  const renderProfileRow = (profileRow: CharacterProfile, index: number) => {
    switch (profileRow.__component) {
      case 'profile.photo':
        return (
          <Image
            key={index}
            source={{
              uri:
                Config.STRAPI_DOMAIN_URL +
                profileRow.image?.data?.attributes?.url,
            }}
            style={{ width: 100, height: 100 }}
          />
        );
      case 'profile.text-prompt':
        return (
          <View>
            <Text key={index + '-title'} style={styles.characterDescription}>
              {profileRow.profile_prompt_title?.data?.attributes?.title}
            </Text>
            <Text key={index + '-answer'} style={styles.characterDescription}>
              {profileRow.answer?.map((answer: Answer) =>
                answer.children.map((answerChild: AnswerChild) =>
                  answerChild.children.map((answerChildChild, index) => (
                    <Text key={index}>{answerChildChild.text}</Text>
                  ))
                )
              )}
            </Text>
          </View>
        );
      // Ajoute d'autres cas ici selon les types de __component que tu as
      default:
        return null;
    }
  };

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
      {character.profile?.map((profileRow, index) =>
        renderProfileRow(profileRow, index as number)
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

const styles = StyleSheet.create({
  characterName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  characterDescription: {
    fontSize: 14,
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
