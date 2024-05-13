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
import Button from '@/components/common/Button';
import ChatBubbleEndpoint from '@/assets/images/chatbubble-endpoint.svg';

interface Props extends PressableProps {
  text: string;
  userSent: boolean;
  avatarUrl?: string;
  action?: MessageAction[];
  selectedLandmarkId?: number;
}

const MessageBubble = ({
  text,
  userSent,
  avatarUrl,
  action,
  selectedLandmarkId,
  ...rest
}: Props) => {
  const handleMessagePress = useCallback(() => {
    if (action !== undefined && action.length > 0) {
      const landmarkId = action[0].landmark.data.id;

      router.push({
        pathname: '/map',
        params: {
          landmarkId,
        },
      });
    }
  }, []);

  /**
   * Style array is impossible with SVG transformer so we have to use a function
   */
  const getDynamicStyle = useCallback((): any => {
    return userSent ? styles.userBubbleEndpoint : styles.bubbleEndpoint;
  }, []);

  return (
    <View style={[styles.message, userSent && styles.userMessage]}>
      {userSent ? null : <Avatar src={avatarUrl} />}
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
          {action !== undefined && action.length > 0 && (
            <Button
              onPress={handleMessagePress}
              style={styles.button}
              color="orange"
            >
              Voir sur la carte
            </Button>
          )}
        </View>
        <ChatBubbleEndpoint style={getDynamicStyle()} />
      </Pressable>
      {userSent ? <Avatar isUser /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  message: {
    marginBottom: Sizes.pageContentVerticalMargin,
    // marginVertical: Sizes.pageContentVerticalMargin,
    marginHorizontal: Sizes.pageContentHorizontalMargin,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  messageContent: {
    gap: 8,
    flexShrink: 1,
    paddingBottom: 16,
    // TODO: le background color ne prends que la largeur de la plus longue ligne de texte
  },
  messageBubble: {
    padding: Sizes.padding,
    borderRadius: Sizes.borderRadius,
    backgroundColor: Colors.lightBeige,
    borderWidth: 2,
    borderColor: Colors.darkGrey,
    shadowColor: Colors.darkGrey,
    shadowOffset: {
      width: 4,
      height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  userMessageBubble: {
    backgroundColor: Colors.orange,
  },
  actionMessage: {
    // backgroundColor: Colors.yellow,
  },
  messageText: {
    color: Colors.darkGrey,
  },
  userMessageText: {
    color: Colors.lightGrey,
  },
  bubbleEndpoint: {
    position: 'absolute',
    top: '100%',
    marginTop: -2,
    zIndex: 2,
    left: 4,
    color: Colors.lightBeige,
    shadowColor: Colors.darkGrey,
    shadowOffset: {
      width: 4,
      height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  userBubbleEndpoint: {
    position: 'absolute',
    top: '100%',
    marginTop: -2,
    zIndex: 2,
    right: 4,
    color: Colors.orange,
    transform: [{ scaleX: -1 }],
    shadowColor: Colors.darkGrey,
    shadowOffset: {
      width: -4,
      height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  button: {
    marginVertical: Sizes.padding,
    borderWidth: 0,
    alignSelf: 'flex-start',
  },
});

export default MessageBubble;
