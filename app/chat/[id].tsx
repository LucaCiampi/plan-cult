import { View, Text, StyleSheet } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { useSelector } from "react-redux";
import { selectLikedCharacters } from "@/features/characters/charactersSlice";
import { useEffect, useState } from "react";

export default function ChatWithCharacterPage() {
  const { id } = useLocalSearchParams();
  const likedCharacters = useSelector(selectLikedCharacters);
  const [character, setCharacter] = useState<Character | null>(null);

  useEffect(() => {
    // Trouver le personnage par id
    const char = likedCharacters.find((c) => c.id.toString() === id);
    setCharacter(char ?? null);
  }, [id, likedCharacters]);

  if (!character) {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: "Introuvable",
          }}
        />
        <Text>Discussion introuvable</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: `${character.name} ${character.surname ?? ""}`,
          headerBackTitle: "Retour",
        }}
      />
      {/* Afficher les détails du personnage ici */}
      <Text>{character.name}</Text>
      {/* Autres détails */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
