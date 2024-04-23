// CharacterChatItem.tsx
import React, { useCallback } from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import Avatar from '@/components/common/Avatar';
import Sizes from '@/constants/Sizes';
import Colors from '@/constants/Colors';

interface CharacterProps {
  character: Character;
}

const CharacterChatItem: React.FC<CharacterProps> = ({ character }) => {
  const handleNotificationPress = useCallback(() => {
    console.log('rediriger vers le marker carte');
  }, []);

  return (
    <Link style={styles.characterChatItem} push href={`/chat/${character.id}`}>
      <Avatar size="medium" />
      <View style={styles.content}>
        <View style={styles.textContent}>
          <Text style={styles.characterName}>
            {character.name} {character.surname}
          </Text>
          <Text style={styles.lastMessageContent}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci
            nihil recusandae sunt et quia, ipsa at ea quasi repellat magni
            facilis vitae? Necessitatibus laborum eos vel magni autem, sapiente
            et.
          </Text>
        </View>
        <TouchableOpacity
          style={styles.notification}
          onPress={handleNotificationPress}
        />
      </View>
    </Link>
  );
};

const styles = StyleSheet.create({
  characterChatItem: {
    paddingVertical: 12,
    paddingHorizontal: 17,
    display: 'flex',
    gap: 24,
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: Sizes.padding,
  },
  content: {
    flex: 1,
  },
  textContent: {
    gap: 2,
    marginRight: 22,
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
    right: 0,
    transform: 'translateY(-50%)',
    top: '50%',
  },
});

export default CharacterChatItem;
