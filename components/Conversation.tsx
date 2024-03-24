import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { selectConversations } from '@/features/chat/chatSlice';
import Colors from '@/constants/Colors';
import { RootState } from '@/app/store';
import { useDatabaseService } from '@/contexts/DatabaseServiceContext';

const Conversation = ({ characterId }: { characterId: string }) => {
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);
  const conversation = useSelector((state) =>
    selectConversations(state as RootState, characterId)
  );
  const dbService = useDatabaseService();

  const history = dbService.loadConversationFromConversationHistory(
    parseInt(characterId)
  );
  console.log(history);

  useEffect(() => {
    const loadHistory = async () => {
      const history = await dbService.loadConversationFromConversationHistory(
        parseInt(characterId)
      );
      // console.log('history', history);
      // Étape 1: Transformer `history` en `Message[]`
      const historyAsMessages: Message[] = history.map((record: any) => {
        // console.log('record', record);

        // console.log(record.message);
        // TODO: split le tableau de messages

        return {
          text: record.message,
          isUserSent: record.from_user, // Convertit en booléen, supposant que `from_user` est 1 pour l'utilisateur et 0 pour le personnage
        };
      });

      console.log('historyAsMessages', historyAsMessages);

      // Here you'd dispatch an action to merge this history into your Redux state
      // For demonstration, assuming it's automatically merged into `conversation`
      setConversationHistory(historyAsMessages);

      setIsInitialLoad(false);
    };

    void loadHistory();
  }, []);

  useEffect(() => {
    if (!isInitialLoad) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [conversation, isInitialLoad]);

  return (
    <ScrollView ref={scrollViewRef}>
      {conversationHistory?.map((message: Message, index: number) => (
        <View
          key={index}
          style={[
            styles.message,
            message.isUserSent ? styles.userMessage : styles.characterMessage,
          ]}
        >
          <Text>{message.text}</Text>
        </View>
      ))}
      {conversation?.map((message: Message, index: number) => (
        <View
          key={index}
          style={[
            styles.message,
            message.isUserSent ? styles.userMessage : styles.characterMessage,
          ]}
        >
          <Text>{message.text}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  message: {
    padding: 10,
    borderRadius: 10,
    margin: 5,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.secondary,
    color: 'white',
  },
  characterMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    color: 'black',
  },
});

export default Conversation;
