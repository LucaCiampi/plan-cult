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

const Questions = ({ characterId }: { characterId: string }) => {
  const dispatch = useDispatch();
  const currentQuestions = useSelector((state) =>
    selectCurrentQuestions(state as RootState, characterId)
  );

  /**
   * Sends the dialogue object with user texts, answers and eventual followUp
   * @param question the current Dialogue node
   */
  const handleQuestionClick = (question: Dialogue) => {
    question.question.forEach((newMessage) =>
      dispatch(
        addMessageToConversation({
          characterId,
          message: {
            text: newMessage,
            sender: 'user',
          },
        })
      )
    );

    setTimeout(() => {
      question.answer.forEach((answerMessage) =>
        dispatch(
          addMessageToConversation({
            characterId,
            message: {
              text: answerMessage,
              sender: 'character',
            },
          })
        )
      );

      if (question.followUp != null) {
        dispatch(
          setPreviousQuestions({ characterId, questions: currentQuestions })
        );
        dispatch(
          setCurrentQuestions({ characterId, questions: question.followUp })
        );
      } else {
        dispatch(resetToPreviousQuestions({ characterId }));
      }
    }, 1000);
  };

  return (
    <View style={styles.questionsOptions}>
      {currentQuestions.map((currentQuestion: Dialogue) => (
        <Button
          key={currentQuestion.id}
          onPress={() => {
            handleQuestionClick(currentQuestion);
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
