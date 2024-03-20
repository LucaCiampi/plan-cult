import React from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import { useSelector } from "react-redux";
import { selectLikedCharacters } from "../../features/characters/charactersSlice";
import CharacterChatItem from "@/features/characters/CharacterChatItem";
import { Stack } from "expo-router";

export default function ChatPage() {
  const likedCharacters = useSelector(selectLikedCharacters);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <FlatList
        data={likedCharacters}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.characterContainer}>
            <CharacterChatItem character={item} />
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
