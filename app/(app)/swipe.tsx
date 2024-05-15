import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import CharacterCard from '@/components/characters/CharacterCard';
import { useSelector } from 'react-redux';
import {
  selectLikedCharacters,
  selectAllCharacters,
} from '@/slices/charactersSlice';
import { useDatabaseService } from '@/contexts/DatabaseServiceContext';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { selectLocation } from '@/slices/locationSlice';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { haversineDistance } from '@/utils/randomUtils';
import { minDistanceToSwipeCharacter } from '@/constants/Coordinates';

export default function SwipePage() {
  const [loadedCharactersProfiles, setLoadedCharacterProfiles] = useState<
    Character[]
  >([]);
  const [charactersNearby, setCharactersNearby] = useState<Character[]>([]);
  const [charactersNearbyNotLiked, setCharactersNearbyNotLiked] = useState<
    Character[]
  >([]);
  const dbService = useDatabaseService();

  // Récupération de la position de l'utilisateur depuis Redux
  const [userLocation] = useState({
    latitude: 45.767135,
    longitude: 4.833658,
  });

  // Récupération des profils likés depuis Redux
  const allCharacters = useSelector(selectAllCharacters);
  const likedCharacters = useSelector(selectLikedCharacters);

  console.log('💚 allCharacters', allCharacters);
  console.log('💚 likedCharacters', likedCharacters);
  console.log('💚 loadedCharactersProfiles', loadedCharactersProfiles);
  console.log('💚 charactersNearby', charactersNearby);
  console.log('💚 charactersNearbyNotLiked', charactersNearbyNotLiked);

  /**
   * Récupère les profils à proximité
   */
  useEffect(() => {
    if (userLocation !== undefined && allCharacters.length > 0) {
      const nearbyCharacters = allCharacters.filter((character) => {
        if (character.coordinates !== undefined) {
          const distance = haversineDistance(
            userLocation,
            character.coordinates
          );
          return distance <= minDistanceToSwipeCharacter; // Périmètre défini de 500 mètres
        }
        return false;
      });
      setCharactersNearby(nearbyCharacters);
      const notLikedNearbyCharacters = nearbyCharacters.filter(
        (character) =>
          !likedCharacters.some((liked) => liked.id === character.id)
      );
      setCharactersNearbyNotLiked(notLikedNearbyCharacters);
    } else {
      console.log('👺 Pas de profils à proximité', userLocation, allCharacters);
    }
  }, [userLocation, allCharacters, likedCharacters]);

  /**
   * Charge les profils complets des 2 premiers ou derniers profils
   * parmi les profils à proximité non likés
   */
  const loadCharacterProfiles = useCallback(async () => {
    if (charactersNearbyNotLiked.length > 0) {
      const profilesToLoad = charactersNearbyNotLiked
        .slice(-2)
        .map(async (character) => {
          const profile = await dbService.getCharacterProfile(character.id);
          return profile;
        });
      const newProfiles = await Promise.all(profilesToLoad);
      setLoadedCharacterProfiles(newProfiles);
    }
  }, [charactersNearbyNotLiked, dbService]);

  useEffect(() => {
    void loadCharacterProfiles();
  }, [charactersNearbyNotLiked, loadCharacterProfiles]);

  if (loadedCharactersProfiles.length === 0) {
    return (
      <View style={styles.centeredContainer}>
        <Text>Pas de profil dans les parages</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={loadedCharactersProfiles}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <CharacterCard character={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
