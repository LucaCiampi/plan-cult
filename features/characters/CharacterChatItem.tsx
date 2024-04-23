// CharacterChatItem.tsx
import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { Link } from 'expo-router';

interface CharacterProps {
  character: Character;
}

const CharacterChatItem: React.FC<CharacterProps> = ({ character }) => {
  return (
    <Link push href={`/(app)/chat/${character.id}`}>
      <View style={styles.characterItem}>
        <Text style={styles.characterName}>
          {character.name} {character.surname}
        </Text>
      </View>
    </Link>
  );
};

const styles = StyleSheet.create({
  characterItem: {
    padding: 20,
  },
  characterName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  characterDescription: {
    fontSize: 14,
  },
});

export default CharacterChatItem;
