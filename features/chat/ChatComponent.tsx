import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { setCurrentQuestions } from './chatSlice';
import Conversation from '@/components/Conversation';
import Questions from '@/components/Questions';

// TODO: rendre dynamique
import dialoguesData from '@/assets/dialogues/test/dialogue.json';

const ChatComponent = ({ characterId }: { characterId: string }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialiser avec le premier niveau de questions du JSON
    dispatch(
      setCurrentQuestions({
        characterId,
        // TODO: remplacer any[]
        questions: dialoguesData[0] as any[],
      })
    );
  }, [dispatch]);

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
