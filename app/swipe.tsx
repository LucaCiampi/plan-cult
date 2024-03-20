import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import {
  prepareDatabase,
  retrieveAllFromDatabaseTable,
} from "@/services/databaseService";
import CharacterComponent from "@/features/characters/CharacterComponent";
import { useDispatch, useSelector } from "react-redux";
import {
  setCharacters,
  selectLikedCharacters,
} from "@/features/characters/charactersSlice";

export default function SwipePage() {
  const [characters, setCharactersState] = useState<Character[]>([]);
  const dispatch = useDispatch();
  // Sélectionnez l'état des personnages likés depuis Redux
  const likedCharacters = useSelector(selectLikedCharacters);

  useEffect(() => {
    async function fetchData() {
      const db = await prepareDatabase(true);
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
  }, [dispatch, likedCharacters]); // Ajoutez likedCharacters dans le tableau des dépendances

  return (
    <View>
      <FlatList
        data={characters}
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
  characterContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
  },
});
