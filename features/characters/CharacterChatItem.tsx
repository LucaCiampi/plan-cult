// CharacterChatItem.tsx
import React from "react";
import { Text, StyleSheet } from "react-native";
import { Link } from "expo-router";

interface CharacterProps {
  character: Character;
}

const CharacterChatItem: React.FC<CharacterProps> = ({ character }) => {
  return (
    <Link push href={`/chat/${character.id}`}>
      <Text style={styles.characterName}>
        {character.name} {character.surname}
      </Text>
    </Link>
  );
};

const styles = StyleSheet.create({
  characterName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  characterDescription: {
    fontSize: 14,
  },
});

export default CharacterChatItem;
