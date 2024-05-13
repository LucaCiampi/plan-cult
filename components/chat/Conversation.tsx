import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  SpeakingState,
  selectConversations,
  selectSpeakingState,
} from '@/slices/chatSlice';
import { RootState } from '@/app/store';
import { useDatabaseService } from '@/contexts/DatabaseServiceContext';
import MessageBubble from '@/components/chat/MessageBubble';

interface Props {
  characterId: string;
  character: Character;
}

const Conversation = ({ characterId, character }: Props) => {
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);
  const conversation = useSelector((state) =>
    selectConversations(state as RootState, characterId)
  );
  const dbService = useDatabaseService();
  const currentCharacterSpeakingState = useSelector((state) =>
    selectSpeakingState(state as RootState, characterId)
  );

  useEffect(() => {
    const loadHistory = async () => {
      const history = await dbService.loadConversationFromConversationHistory(
        parseInt(characterId)
      );

      console.log(history, 'history');

      const historyAsMessages: Message[] = history.map((record: any) => {
        return {
          text: record.message,
          isUserSent: record.from_user ?? 0,
        };
      });

      try {
        console.log(historyAsMessages, 'historyAsMessages');

        setConversationHistory(historyAsMessages);
      } catch (e) {
        console.error('Could not save conversation history', e);
      }

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
      <View style={styles.topSpacer} />
      {conversationHistory?.map((message: Message, index: number) => (
        <MessageBubble
          key={index}
          userSent={message.isUserSent}
          text={message.text}
          // avatarUrl={character.avatar_url}
        />
      ))}
      {conversation?.map((message: Message, index: number) => (
        <MessageBubble
          key={index}
          userSent={message.isUserSent}
          text={message.text}
          action={message.action}
          // avatarUrl={character.avatar_url}
        />
      ))}
      <View
        style={[
          styles.bottomSpacer,
          currentCharacterSpeakingState !== SpeakingState.Idle &&
            styles.bottomSpacerTaller,
        ]}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  topSpacer: {
    height: 10,
  },
  bottomSpacer: {
    height: 180,
  },
  bottomSpacerTaller: {
    height: 240,
  },
});

export default Conversation;
