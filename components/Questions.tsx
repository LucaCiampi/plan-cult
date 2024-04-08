import { useDispatch, useSelector } from 'react-redux';
import { View, StyleSheet } from 'react-native';
import Button from '@/components/common/Button';
import { RootState } from '@/app/store';
import {
  addMessageToConversation,
  setCurrentQuestions,
  selectCurrentQuestions,
} from '@/features/chat/chatSlice';
import { randomBetween } from '@/utils/randomUtils';
import { useCallback } from 'react';
import { useDatabaseService } from '@/contexts/DatabaseServiceContext';

const Questions = ({ characterId }: { characterId: string }) => {
  const dispatch = useDispatch();
  const currentQuestions = useSelector((state) =>
    selectCurrentQuestions(state as RootState, characterId)
  );
  const dbService = useDatabaseService();

  /**
   * Sends the dialogue object with user texts, answers and eventual followUp
   * @param question the current Dialogue node
   */
  const handleQuestionClick = (question: Dialogue) => {
    sendMessagesOrganically(question.questions, true); // Pour les questions, isUserSent est true

    const totalDelayForQuestions =
      question.questions.length * randomBetween(1, 3) * 1000;

    setTimeout(() => {
      sendMessagesOrganically(question.answers, false); // Pour les réponses, isUserSent est false
    }, totalDelayForQuestions);

    if (question.follow_up != null) {
      const nextQuestionsId: number[] = [];

      question.follow_up?.data.forEach((nextQuestion) => {
        nextQuestionsId.push(nextQuestion.id);
      });

      dbService
        .getDialoguesOfId(nextQuestionsId)
        .then((nextQuestions) => {
          dispatch(
            setCurrentQuestions({
              characterId,
              questions: nextQuestions,
            })
          );
        })
        .catch((error) => {
          console.error('Failed to get next questions', error);
        });
    }

    void dbService.saveCurrentDialogueNodeProgress(
      parseInt(characterId),
      question.id
    );
    console.log('coucou');
  };

  /**
   * Sends messages with a small random delay to add authenticity
   */
  const sendMessagesOrganically = useCallback(
    (messages: StrapiMessage[], isUserSent: boolean) => {
      messages.forEach((message, index) => {
        const delay = index * randomBetween(1, 3) * 1000;

        void dbService.saveConversationToConversationHistory(
          parseInt(characterId),
          isUserSent,
          message.text[0].children[0].text
        );

        setTimeout(() => {
          dispatch(
            addMessageToConversation({
              characterId,
              message: {
                text: message.text[0].children[0].text,
                isUserSent,
              },
            })
          );
        }, delay);
      });
    },
    []
  );

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
