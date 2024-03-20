// CharacterCard.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { likeCharacter } from "./charactersSlice";
import Button from "@/components/common/Button";

interface CharacterProps {
  character: Character;
}

const CharacterCard: React.FC<CharacterProps> = ({ character }) => {
  const dispatch = useDispatch();

  return (
    <>
      <Text style={styles.characterName}>
        {character.name} {character.surname}
      </Text>
      {character.birth && (
        <Text style={styles.characterDescription}>{character.birth}</Text>
      )}
      <View style={styles.buttonsContainer}>
        <Button
          style={styles.button}
          onPress={() => {
            console.log(`${character.name} disliked, no effect`);
          }}
        >
          Dislike
        </Button>
        <Button
          style={styles.button}
          onPress={() => {
            dispatch(likeCharacter(character.id));
          }}
        >
          Like
        </Button>
      </View>
    </>
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
  buttonsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 24,
  },
  button: {
    flex: 1,
  },
});

export default CharacterCard;
