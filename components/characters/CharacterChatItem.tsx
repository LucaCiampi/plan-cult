// CharacterChatItem.tsx
import React, { useCallback } from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import Avatar from '@/components/common/Avatar';
import Sizes from '@/constants/Sizes';
import Colors from '@/constants/Colors';
import { router } from 'expo-router';

interface CharacterProps {
  character: Character;
}

const CharacterChatItem: React.FC<CharacterProps> = ({ character }) => {
  const handleCharacterChatItemPress = useCallback(() => {
    router.push(`/chat/${character.id}`);
  }, []);

  const handleNotificationPress = useCallback(() => {
    console.log('rediriger vers le marker carte');
  }, []);

  return (
    <View style={styles.characterChatItem}>
      <TouchableOpacity onPress={handleCharacterChatItemPress}>
        <View style={styles.content}>
          <Avatar src={character.avatar_url} size="medium" />
          <View style={styles.textContent}>
            <Text style={styles.characterName}>
              {character.name} {character.surname}
            </Text>
            <Text style={styles.lastMessageContent}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci
              nihil recusandae sunt et quia, ipsa at ea quasi repellat magni.
            </Text>
          </View>
          <TouchableOpacity
            style={styles.notification}
            onPress={handleNotificationPress}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  characterChatItem: {
    paddingVertical: 12,
    paddingHorizontal: 17,
    backgroundColor: Colors.white,
    borderRadius: Sizes.borderRadius,
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  textContent: {
    gap: 2,
    marginRight: Sizes.padding + 16,
    flex: 1,
  },
  characterName: {
    fontSize: Sizes.regularFontSize,
    fontWeight: 'bold',
  },
  lastMessageContent: {
    fontSize: Sizes.miniFontSize,
  },
  notification: {
    width: 14,
    height: 14,
    borderRadius: 9999,
    backgroundColor: Colors.yellow,
    position: 'absolute',
    right: Sizes.padding,
    top: '50%',
  },
});

export default CharacterChatItem;
