import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { setCurrentQuestions } from './chatSlice';
import Conversation from '@/components/Conversation';
import Questions from '@/components/Questions';

// TODO: rendre dynamique
import { useDatabaseService } from '@/contexts/DatabaseServiceContext';

const ChatComponent = ({ characterId }: { characterId: string }) => {
  const dispatch = useDispatch();
  const dbService = useDatabaseService();

  useEffect(() => {
    const fetchCurrentQuestions = async () => {
      // Initialiser avec le premier niveau de questions du JSON
      // const lastDialogueID = dbService.getCurrentDialogueNodeProgress(
      //   parseInt(characterId)
      // );
      // console.log('❤️ lastDialogueID', lastDialogueID);
      const lastDialogueID = [1, 2];

      const currentQuestions = await dbService.getDialoguesOfId(lastDialogueID);
      console.log('❤️ currentQuestions', currentQuestions);

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
