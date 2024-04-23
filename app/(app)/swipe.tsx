import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import CharacterCard from '@/components/characters/CharacterCard';
import { useDispatch, useSelector } from 'react-redux';
import { setCharacters, selectLikedCharacters } from '@/slices/charactersSlice';
import { useDatabaseService } from '@/contexts/DatabaseServiceContext';

export default function SwipePage() {
  const [charactersWaiting, setCharactersWaiting] = useState<Character[]>([]);
  const dbService = useDatabaseService();
  const dispatch = useDispatch();

  // Récupération des profils likés depuis Redux
  const likedCharacters = useSelector(selectLikedCharacters);

  useEffect(() => {
    const fetchAllCharacters = async () => {
      let allCharactersFromDb = await dbService.getAllCharacters();

      // Filtre les personnages likés de la liste à afficher
      allCharactersFromDb = allCharactersFromDb.filter(
        (character) =>
          !likedCharacters.some((liked) => liked.id === character.id)
      );

      if (allCharactersFromDb.length > 0) {
        // Accède au dernier ID de profil dans charactersWaiting
        const lastProfileId =
          allCharactersFromDb[allCharactersFromDb.length - 1].id;
        // Appelle getCharacterProfile pour obtenir le profil détaillé
        const newProfile = await dbService.getCharacterProfile(lastProfileId);
        // Ajoute ce profil à charactersProfile
        setCharactersWaiting((prevProfiles) => [newProfile]);
        dispatch(setCharacters(allCharactersFromDb));
      }
    };

    void fetchAllCharacters();
  }, [dispatch, likedCharacters]);

  if (charactersWaiting.length === 0) {
    return (
      <View style={styles.centeredContainer}>
        <Text>Pas de profil dans les parages</Text>
      </View>
    );
  }

  return (
    <View>
      <FlatList
        data={charactersWaiting}
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
