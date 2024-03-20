import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import {
  prepareDatabase,
  retrieveAllFromDatabaseTable,
} from "@/services/databaseService";
import CharacterCard from "@/features/characters/CharacterCard";
import { useDispatch, useSelector } from "react-redux";
import {
  setCharacters,
  selectLikedCharacters,
} from "@/features/characters/charactersSlice";

export default function SwipePage() {
  const [characters, setCharactersState] = useState<Character[]>([]);
  const dispatch = useDispatch();

  // Récupération des profils likés depuis Redux
  const likedCharacters = useSelector(selectLikedCharacters);

  useEffect(() => {
    async function fetchData() {
      const db = await prepareDatabase();
      let charactersData = await retrieveAllFromDatabaseTable(db);

      // Filtrez les personnages likés de la liste à afficher
      charactersData = charactersData.filter(
        (character) =>
          !likedCharacters.some((liked) => liked.id === character.id)
      );

      setCharactersState(charactersData as Character[]);
      dispatch(setCharacters(charactersData as Character[]));
    }

    fetchData();
  }, [dispatch, likedCharacters]);

  if (characters.length === 0) {
    return (
      <View style={styles.centeredContainer}>
        <Text>Pas de profil dans les parages</Text>
      </View>
    );
  }

  return (
    <View>
      <FlatList
        data={characters}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.characterContainer}>
            <CharacterCard character={item} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  characterContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
