import React from 'react';
import { StyleSheet, PressableProps, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { likeCharacter } from '@/slices/charactersSlice';
import {
  SpeakingState,
  initializeCharacterChatState,
} from '@/slices/chatSlice';
import SendIcon from '@/assets/images/send.svg';
import Sizes from '@/constants/Sizes';

interface Props extends PressableProps {
  characterId: number;
}

const Button = ({ characterId, ...rest }: Props) => {
  const dispatch = useDispatch();

  return (
    <TouchableOpacity
      style={styles.likeButton}
      onPress={() => {
        dispatch(likeCharacter(characterId));
        const initialChatState = {
          conversation: [],
          currentQuestions: [],
          previousQuestions: [],
          speakingState: SpeakingState.Idle,
        };
        const characterIdString = characterId.toString();
        dispatch(
          initializeCharacterChatState({
            characterId: characterIdString,
            initialChatState,
          })
        );
      }}
    >
      <SendIcon width={40} height={40} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  likeButton: {
    position: 'absolute',
    right: Sizes.padding,
    bottom: Sizes.padding,
  },
});

export default Button;
