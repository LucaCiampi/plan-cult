import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentQuestions, setCurrentQuestions } from './chatSlice';
import Conversation from '@/components/Conversation';
import Questions from '@/components/Questions';
import { useDatabaseService } from '@/contexts/DatabaseServiceContext';
import { RootState } from '@/app/store';

const ChatComponent = ({ characterId }: { characterId: string }) => {
  const dispatch = useDispatch();
  const dbService = useDatabaseService();

  const currentQuestionsChatComponent = useSelector((state) =>
    selectCurrentQuestions(state as RootState, characterId)
  );

  console.log(currentQuestionsChatComponent);

  useEffect(() => {
    const fetchCurrentQuestions = async () => {
      console.log('fetchCurrentQuestions', currentQuestionsChatComponent);

      if (currentQuestionsChatComponent.length === 0) {
        console.log('⚠️ currentQuestionsChatComponent.length === 0');
        const currentQuestions = await dbService.getCurrentDialogueNodeProgress(
          parseInt(characterId)
        );

        dispatch(
          setCurrentQuestions({
            characterId,
            questions: currentQuestions,
          })
        );
      } else {
        console.log('⚠️ Il existait déjà des questions dans redux');
      }

      // Récupérer le dernier dialogue non envoyé
    };

    void fetchCurrentQuestions();
  }, []);

  return (
    <>
      <View style={styles.chatView}>
        <Conversation characterId={characterId} />
        <Questions characterId={characterId} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  chatView: {
    height: '100%',
  },
});

export default ChatComponent;
