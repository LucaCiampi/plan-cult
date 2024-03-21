import { useDispatch, useSelector } from 'react-redux';
import { View, StyleSheet } from 'react-native';
import Button from '@/components/common/Button';
import { RootState } from '@/app/store';
import {
  addMessageToConversation,
  setCurrentQuestions,
  setPreviousQuestions,
  resetToPreviousQuestions,
  selectCurrentQuestions,
} from '@/features/chat/chatSlice';
import { useEffect } from 'react';

const Questions = ({ characterId }: { characterId: string }) => {
  const dispatch = useDispatch();
  const currentQuestions = useSelector((state) =>
    selectCurrentQuestions(state as RootState, characterId)
  );

  useEffect(() => {
    // Assurez-vous d'avoir un état initial valide à passer ici
    // const initialChatState = {
    //   conversation: [],
    //   currentQuestions: [],
    //   previousQuestions: [],
    // };
    // dispatch(initializeCharacterChatState({ characterId, initialChatState }));
  }, [characterId, dispatch]);

  const handleQuestionClick = (
    question: Message[],
    answers: Message[],
    followUp: Dialogue[] | undefined
  ) => {
    question.forEach((newMessage) =>
      dispatch(addMessageToConversation({ characterId, message: newMessage }))
    );

    setTimeout(() => {
      answers.forEach((answer) =>
        dispatch(addMessageToConversation({ characterId, message: answer }))
      );

      if (followUp != null) {
        dispatch(
          setPreviousQuestions({ characterId, questions: currentQuestions })
        );
        dispatch(setCurrentQuestions({ characterId, questions: followUp }));
      } else {
        dispatch(resetToPreviousQuestions({ characterId }));
      }
    }, 1000);
  };

  console.log(currentQuestions);

  return (
    <View style={styles.questionsOptions}>
      {currentQuestions.map((currentQuestion: Dialogue) => (
        <Button
          key={currentQuestion.id}
          onPress={() => {
            handleQuestionClick(
              [{ text: currentQuestion.question, sender: 'user' }],
              currentQuestion.answer.map((a) => ({
                text: a,
                sender: 'character',
              })),
              currentQuestion.followUp
            );
          }}
        >
          {currentQuestion.question_short}
        </Button>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  questionsOptions: {
    gap: 6,
    padding: 6,
  },
});

export default Questions;
