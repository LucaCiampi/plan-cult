import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { setCurrentQuestions } from './chatSlice';
import Conversation from '@/components/Conversation';
import Questions from '@/components/Questions';
import { useDatabaseService } from '@/contexts/DatabaseServiceContext';

const ChatComponent = ({ characterId }: { characterId: string }) => {
  const dispatch = useDispatch();
  const dbService = useDatabaseService();

  useEffect(() => {
    const fetchCurrentQuestions = async () => {
      // Récupérer le dernier dialogue non envoyé
      const currentQuestions = await dbService.getCurrentDialogueNodeProgress(
        parseInt(characterId)
      );

      dispatch(
        setCurrentQuestions({
          characterId,
          questions: currentQuestions,
        })
      );
    };

    void fetchCurrentQuestions();
  }, [dispatch, characterId, dbService]);

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
