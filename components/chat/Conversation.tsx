import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { ScrollView } from 'react-native';
import { selectConversations } from '@/slices/chatSlice';
import { RootState } from '@/app/store';
import { useDatabaseService } from '@/contexts/DatabaseServiceContext';
import MessageBubble from './MessageBubble';

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
        <MessageBubble
          key={index}
          userSent={message.isUserSent}
          text={message.text}
        />
      ))}
      {conversation?.map((message: Message, index: number) => (
        <MessageBubble
          key={index}
          userSent={message.isUserSent}
          text={message.text}
          action={message.action}
        />
      ))}
    </ScrollView>
  );
};

export default Conversation;
