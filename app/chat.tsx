import React from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import { useSelector } from "react-redux";
import { selectLikedCharacters } from "../features/characters/charactersSlice";
import CharacterComponent from "../features/characters/CharacterComponent";

export default function ChatPage() {
  const likedCharacters = useSelector(selectLikedCharacters);

  console.log("coucou");
  console.log(likedCharacters); // Dans ChatPage pour vérifier les personnages likés

  return (
    <View style={styles.container}>
      <FlatList
        data={likedCharacters}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.characterContainer}>
            <CharacterComponent character={item} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  characterContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
  },
});
