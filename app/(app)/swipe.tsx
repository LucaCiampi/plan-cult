import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import CharacterCard from '@/components/characters/CharacterCard';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectLikedCharacters,
  updateCharacterCoordinates,
  selectAllCharacters,
} from '@/slices/charactersSlice';
import { useDatabaseService } from '@/contexts/DatabaseServiceContext';
import { AppDispatch } from '@/app/store';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { selectLocation } from '@/slices/locationSlice';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { haversineDistance } from '@/utils/randomUtils';

export default function SwipePage() {
  const [loadedCharactersProfiles, setLoadedCharacterProfiles] = useState<
    Character[]
  >([]);
  const [charactersNearby, setCharactersNearby] = useState<Character[]>([]);
  const [charactersNearbyNotLiked, setCharactersNearbyNotLiked] = useState<
    Character[]
  >([]);
  const dbService = useDatabaseService();
  const dispatch = useDispatch<AppDispatch>(); // Utiliser le type AppDispatch

  // Récupération de la position de l'utilisateur depuis Redux
  // const userLocation = useSelector(selectLocation);
  const [userLocation] = useState({
    latitude: 45.767135,
    longitude: 4.833658,
  });

  // Récupération des profils likés depuis Redux
  const allCharacters = useSelector(selectAllCharacters);
  const likedCharacters = useSelector(selectLikedCharacters);

  /**
   * Récupère les profils à proximité
   */
  useEffect(() => {
    if (userLocation != null && allCharacters.length > 0) {
      const nearbyCharacters = allCharacters.filter((character) => {
        if (character.coordinates !== undefined) {
          const distance = haversineDistance(
            userLocation,
            character.coordinates
          );
          return distance <= 500; // Périmètre défini de 500 mètres
        } else return false;
      });
      setCharactersNearby(nearbyCharacters);
      const charactersNearbyNotLiked = nearbyCharacters.filter(
        (character) =>
          !likedCharacters.some((liked) => liked.id === character.id)
      );
      setCharactersNearbyNotLiked(charactersNearbyNotLiked);
    } else {
      console.log('👺 Pas de profils à proximité', userLocation, allCharacters);
    }
  }, [userLocation, allCharacters]);

  /**
   * Charge le profil complet des 2 derniers profils
   * parmi les profils à proximité
   */
  useEffect(() => {
    void (async () => {
      if (charactersNearbyNotLiked.length > 0) {
        // Accède au dernier ID de profil dans loadedCharactersProfiles
        const lastProfileId =
          charactersNearbyNotLiked[charactersNearbyNotLiked.length - 1].id;
        // Appelle getCharacterProfile pour obtenir le profil détaillé
        const newProfile = await dbService.getCharacterProfile(lastProfileId);
        // Ajoute ce profil à charactersProfile
        setLoadedCharacterProfiles((prevProfiles) => [newProfile]);
      }
    })();
  }, [charactersNearbyNotLiked]);

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
        // contentContainerStyle={styles.characterContainer}
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
