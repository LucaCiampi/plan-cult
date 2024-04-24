import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { selectConversations } from '@/slices/chatSlice';
import Colors from '@/constants/Colors';
import { RootState } from '@/app/store';
import { useDatabaseService } from '@/contexts/DatabaseServiceContext';
import { router } from 'expo-router';
import Dimensions from '@/constants/Sizes';
import Avatar from '@/components/common/Avatar';

interface Props {
  characterId: string;
}

const Conversation = ({ characterId }: Props) => {
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
      style={[
        styles.message,
        message.isUserSent ? styles.userMessage : styles.characterMessage,
      ]}
    >
      {message.isUserSent ? null : <Avatar />}
      <View
        key={index}
        style={[
          styles.messageBubble,
          message.isUserSent
            ? styles.userMessageBubble
            : styles.characterMessageBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            message.isUserSent ? styles.userMessageText : null,
          ]}
        >
          {message.text}
        </Text>
      </View>
      {message.isUserSent ? <Avatar /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  message: {
    margin: 7,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  characterMessage: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    padding: Dimensions.padding,
    borderRadius: Dimensions.borderRadius,
  },
  userMessageBubble: {
    backgroundColor: Colors.purple,
    borderBottomEndRadius: 0,
  },
  characterMessageBubble: {
    backgroundColor: Colors.white,
    borderBottomStartRadius: 0,
  },
  messageText: {
    color: Colors.darkGrey,
  },
  userMessageText: {
    color: Colors.lightGrey,
  },
  actionMessage: {
    backgroundColor: Colors.yellow,
  },
});

export default Conversation;
