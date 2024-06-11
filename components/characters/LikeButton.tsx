import React from 'react';
import {
  StyleSheet,
  PressableProps,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { dislikeCharacter, likeCharacter } from '@/slices/charactersSlice';
import {
  SpeakingState,
  initializeCharacterChatState,
} from '@/slices/chatSlice';
import LikeIcon from '@/assets/images/like.svg';
import DislikeIcon from '@/assets/images/dislike.svg';
import Sizes from '@/constants/Sizes';
import Colors from '@/constants/Colors';

interface Props extends PressableProps {
  characterId: number;
}

const LikeButton = ({ characterId, ...rest }: Props) => {
  const dispatch = useDispatch();

  return (
    <View style={styles.buttonsContainer}>
      <TouchableOpacity
        onPress={() => {
          dispatch(dislikeCharacter(characterId));
        }}
      >
        <DislikeIcon width={40} height={40} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          dispatch(likeCharacter(characterId));
          const initialChatState = {
            conversation: [],
            currentQuestions: [],
            previousQuestions: [],
            lastMessage: '',
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
        <LikeIcon width={40} height={40} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonsContainer: {
    position: 'absolute',
    bottom: Sizes.padding,
    flexDirection: 'row',
    gap: Sizes.padding * 2,
    backgroundColor: Colors.purple,
    paddingVertical: Sizes.padding,
    paddingHorizontal: Sizes.padding * 3,
    borderRadius: 999,
    alignSelf: 'center',
    elevation: 3,
    shadowColor: Colors.darkGrey,
    shadowRadius: 0,
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 1,
  },
});

export default LikeButton;
