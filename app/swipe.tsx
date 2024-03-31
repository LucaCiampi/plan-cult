import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import CharacterCard from '@/features/characters/CharacterCard';
import { useDispatch, useSelector } from 'react-redux';
import {
  setCharacters,
  selectLikedCharacters,
} from '@/features/characters/charactersSlice';
import { useDatabaseService } from '@/contexts/DatabaseServiceContext';

export default function SwipePage() {
  const [characters, setCharactersState] = useState<Character[]>([]);
  const dbService = useDatabaseService();
  const dispatch = useDispatch();

  // Récupération des profils likés depuis Redux
  const likedCharacters = useSelector(selectLikedCharacters);

  useEffect(() => {
    const fetchAllCharacters = async () => {
      let allCharactersFromDb = await dbService.getAllCharacters();
      console.log(allCharactersFromDb);

      // Filtre les personnages likés de la liste à afficher
      allCharactersFromDb = allCharactersFromDb.filter(
        (character) =>
          !likedCharacters.some((liked) => liked.id === character.id)
      );

      setCharactersState(allCharactersFromDb);
      dispatch(setCharacters(allCharactersFromDb));
    };

    void fetchAllCharacters();
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
    borderBottomColor: '#cccccc',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
