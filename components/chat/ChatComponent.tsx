import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCurrentQuestions,
  setCurrentQuestions,
} from '@/slices/chatSlice';
import Conversation from '@/components/chat/Conversation';
import Questions from '@/components/chat/Questions';
import { useDatabaseService } from '@/contexts/DatabaseServiceContext';
import { RootState } from '@/app/store';

interface Props {
  characterId: string;
  character: Character;
}

const ChatComponent = ({ characterId, character }: Props) => {
  const dispatch = useDispatch();
  const dbService = useDatabaseService();

  const currentQuestionsChatComponent = useSelector((state) =>
    selectCurrentQuestions(state as RootState, characterId)
  );

  useEffect(() => {
    const fetchCurrentQuestions = async () => {
      const currentQuestions =
        await dbService.getCurrentConversationStateWithCharacter(
          parseInt(characterId)
        );

      dispatch(
        setCurrentQuestions({
          characterId,
          questions: currentQuestions,
        })
      );

      // Récupérer le dernier dialogue non envoyé
    };

    // Ne récupère les questions que si le slice redux est vide
    if (currentQuestionsChatComponent?.length === 0) {
      void fetchCurrentQuestions();
    }
  }, []);

  return (
    <View style={styles.chatView}>
      <Conversation character={character} characterId={characterId} />
      <Questions characterId={characterId} />
    </View>
  );
};

const styles = StyleSheet.create({
  chatView: {
    height: '100%',
  },
});

export default ChatComponent;
