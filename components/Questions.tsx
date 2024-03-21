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
import { randomBetween } from '@/utils/random';

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
    let totalDelayForQuestions = 0;

    question.question.forEach((newMessage, index) => {
      const delay = index * randomBetween(1, 3) * 1000;
      totalDelayForQuestions += delay; // Accumuler le délai pour calculer le départ des réponses

      setTimeout(() => {
        dispatch(
          addMessageToConversation({
            characterId,
            message: {
              text: newMessage,
              isUserSent: true,
            },
          })
        );
      }, totalDelayForQuestions);
    });

    // Utiliser totalDelayForQuestions pour calculer le délai de départ pour les réponses
    // Ajouter un petit délai supplémentaire avant de commencer à afficher les réponses
    const initialDelayForAnswers = totalDelayForQuestions + 1000;

    question.answer.forEach((answerMessage, index) => {
      const delay = randomBetween(1, 3) * 1000;
      setTimeout(() => {
        dispatch(
          addMessageToConversation({
            characterId,
            message: {
              text: answerMessage,
              isUserSent: false,
            },
          })
        );
      }, initialDelayForAnswers + index * delay);
    });

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
