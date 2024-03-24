import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { selectConversations } from '@/features/chat/chatSlice';
import Colors from '@/constants/Colors';
import { RootState } from '@/app/store';
import { useDatabaseService } from '@/contexts/DatabaseServiceContext';

const Conversation = ({ characterId }: { characterId: string }) => {
  const conversation = useSelector((state) =>
    selectConversations(state as RootState, characterId)
  );
  const dbService = useDatabaseService();

  const scrollViewRef = useRef<ScrollView>(null);

  const history = dbService.loadConversationFromConversationHistory(
    parseInt(characterId)
  );
  console.log(history);

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [conversation]);

  return (
    <ScrollView ref={scrollViewRef}>
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
