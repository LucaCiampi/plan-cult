import Colors from '@/constants/Colors';
import Sizes from '@/constants/Sizes';
import React, { useCallback } from 'react';
import {
  Text,
  StyleSheet,
  Pressable,
  PressableProps,
  View,
} from 'react-native';
import Avatar from '@/components/common/Avatar';
import { router } from 'expo-router';

interface Props extends PressableProps {
  text: string;
  userSent: boolean;
  action?: MessageAction[];
  selectedLandmarkId?: number;
}

const MessageBubble = ({
  text,
  userSent,
  action,
  selectedLandmarkId,
  ...rest
}: Props) => {
  const handleMessagePress = useCallback(() => {
    const hasAction = action !== undefined && action.length > 0;

    if (hasAction) {
      const landmarkId = action[0].landmark.data.id;

      router.push({
        pathname: '/map',
        params: {
          landmarkId,
        },
      });
    }
  }, []);

  return (
    <View style={[styles.message, userSent && styles.userMessage]}>
      {userSent ? null : <Avatar />}
      <Pressable
        style={[styles.messageContent]}
        onPress={handleMessagePress}
        {...rest}
      >
        <View
          style={[
            styles.messageBubble,
            userSent && styles.userMessageBubble,
            action !== undefined && action.length > 0 && styles.actionMessage,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              userSent ? styles.userMessageText : null,
            ]}
          >
            {text}
          </Text>
        </View>
      </Pressable>
      {userSent ? <Avatar /> : null}
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
  messageContent: {
    display: 'flex',
    gap: 8,
    flexShrink: 1,
    // TODO: le background color ne prends que la largeur de la plus longue ligne de texte
  },
  messageBubble: {
    padding: Sizes.padding,
    borderRadius: Sizes.borderRadius,
    backgroundColor: Colors.white,
    borderBottomStartRadius: 0,
  },
  userMessageBubble: {
    backgroundColor: Colors.purple,
    borderBottomEndRadius: 0,
  },
  actionMessage: {
    backgroundColor: Colors.yellow,
  },
  messageText: {
    color: Colors.darkGrey,
  },
  userMessageText: {
    color: Colors.lightGrey,
  },
});

export default MessageBubble;
