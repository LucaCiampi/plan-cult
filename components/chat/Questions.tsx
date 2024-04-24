import { useDispatch, useSelector } from 'react-redux';
import { View, StyleSheet } from 'react-native';
import Button from '@/components/common/Button';
import { RootState } from '@/app/store';
import {
  addMessageToConversation,
  setCurrentQuestions,
  selectCurrentQuestions,
} from '@/slices/chatSlice';
import { randomBetween } from '@/utils/randomUtils';
import { useCallback, useState } from 'react';
import { useDatabaseService } from '@/contexts/DatabaseServiceContext';

interface Props {
  characterId: string;
}

const Questions = ({ characterId }: Props) => {
  const dispatch = useDispatch();
  const currentQuestions = useSelector((state) =>
    selectCurrentQuestions(state as RootState, characterId)
  );

  const dbService = useDatabaseService();
  const [allMessagesSent, setAllMessagesSent] = useState(true);
  // const [isTyping, setIsTyping] = useState(false);

  /**
   * Sends the dialogue object with user texts, answers and eventual followUp
   * @param question the current Dialogue node
   */
  const handleQuestionClick = async (question: Dialogue) => {
    setAllMessagesSent(false);

    // Envoi des questions utilisateur de manière graduelle
    await sendMessagesOrganically(question.questions, true);

    // Attendre un délai avant d'envoyer les réponses du character
    await new Promise((resolve) =>
      setTimeout(resolve, randomBetween(2, 5) * 1000)
    );

    // Envoi des réponses du character
    await sendMessagesOrganically(question.answers, false);

    // Attendre un délai avant d'autoriser l'envoi de nouvelles questions
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Autorise l'envoi de messages utilisateur uniquement si tous les messages du dialogues ont étés envoyés
    setAllMessagesSent(true);

    if (question.follow_up?.data[0] != null) {
      const nextQuestionsId: number[] = [];

      question.follow_up.data.forEach((nextQuestion) => {
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

      void dbService.saveCurrentDialogueNodeProgress(
        parseInt(characterId),
        question.id,
        nextQuestionsId
      );
    } else {
      console.log('💬 Plus de questions');
      dispatch(
        setCurrentQuestions({
          characterId,
          questions: null,
        })
      );
    }
  };

  /**
   * Sends messages with a small random delay to add authenticity
   */
  const sendMessagesOrganically = useCallback(
    async (messages: Message[], isUserSent: boolean): Promise<boolean> => {
      const sendMessagePromises = messages.map(async (message, index) => {
        const delay = index * randomBetween(1, 3) * 1000;
        await new Promise<void>((resolve) => {
          setTimeout(() => {
            dispatch(
              addMessageToConversation({
                characterId,
                message: {
                  text: message.text,
                  isUserSent,
                  action: message.action,
                },
              })
            );
            void dbService.saveConversationToConversationHistory(
              Number(characterId),
              isUserSent,
              message.text
            );
            resolve();
          }, delay);
        });
      });
      await Promise.all(sendMessagePromises);
      return true;
    },
    [dispatch, characterId]
  );

  return (
    <View style={styles.questionsOptions}>
      {allMessagesSent &&
        currentQuestions?.map((currentQuestion: Dialogue) => (
          <Button
            key={currentQuestion.id}
            onPress={() => {
              void handleQuestionClick(currentQuestion);
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
