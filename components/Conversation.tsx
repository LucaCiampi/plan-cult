import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { selectConversations } from '@/features/chat/chatSlice';
import Colors from '@/constants/Colors';
import { RootState } from '@/app/store';
import { useDatabaseService } from '@/contexts/DatabaseServiceContext';
import { router } from 'expo-router';

const Conversation = ({ characterId }: { characterId: string }) => {
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);
  const conversation = useSelector((state) =>
    selectConversations(state as RootState, characterId)
  );
  const dbService = useDatabaseService();

  useEffect(() => {
    const loadHistory = async () => {
      const history = await dbService.loadConversationFromConversationHistory(
        parseInt(characterId)
      );

      const historyAsMessages: Message[] = history.map((record: any) => {
        return {
          text: record.message,
          isUserSent: record.from_user,
        };
      });

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
        <MessageComponent key={index} message={message} index={index} />
      ))}
    </ScrollView>
  );
};

const MessageComponent = ({
  message,
  index,
}: {
  message: Message;
  index: number;
}) => {
  if (message.action.length > 0) {
    return (
      <Pressable
        key={index}
        style={[
          styles.message,
          message.isUserSent ? styles.userMessage : styles.characterMessage,
          styles.actionMessage,
        ]}
        onPress={() => {
          router.push({
            pathname: '/map',
            params: {
              selectedLandmarkId: message.action[0].landmark.data.id,
            },
          });
        }}
      >
        <View>
          <Text>{message.text}</Text>
        </View>
      </Pressable>
    );
  }
  return (
    <View
      key={index}
      style={[
        styles.message,
        message.isUserSent ? styles.userMessage : styles.characterMessage,
      ]}
    >
      <Text>{message.text}</Text>
    </View>
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
    backgroundColor: Colors.purple,
    color: 'white',
  },
  characterMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    color: 'black',
  },
  actionMessage: {
    backgroundColor: 'yellow',
  },
});

export default Conversation;
