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
import { selectUserLocation } from '@/slices/userLocationSlice';
import { isNearUser } from '@/utils/distanceUtils';
import LikeButton from '@/components/characters/LikeButton';

export default function SwipePage() {
  const [loadedCharactersProfiles, setLoadedCharacterProfiles] = useState<
    Character[]
  >([]);
  const [charactersNearbyNotLiked, setCharactersNearbyNotLiked] = useState<
    Character[]
  >([]);
  const dbService = useDatabaseService();

  // Récupération de la position de l'utilisateur depuis Redux
  const userLocation = useSelector(selectUserLocation);

  // Récupération des profils likés depuis Redux
  const allCharacters = useSelector(selectAllCharacters);
  const likedCharacters = useSelector(selectLikedCharacters);

  /**
   * Récupère les profils à proximité
   */
  useEffect(() => {
    if (userLocation !== undefined && allCharacters.length > 0) {
      const nearbyCharacters = allCharacters.filter((character) => {
        if (character.coordinates !== undefined) {
          return isNearUser(userLocation, character.coordinates);
        }
        return false;
      });
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
          const profile = await dbService.getCharacterProfile(
            Number(character.id)
          );
          return profile;
        });
      const newProfiles = await Promise.all(profilesToLoad);
      setLoadedCharacterProfiles(newProfiles);
    }
  }, [charactersNearbyNotLiked, dbService]);

  useEffect(() => {
    void loadCharacterProfiles();
  }, [charactersNearbyNotLiked, loadCharacterProfiles]);

  /**
   * Met à jour loadedCharactersProfiles lorsque les profils likés changent
   */
  useEffect(() => {
    setLoadedCharacterProfiles((prevProfiles) =>
      prevProfiles.filter(
        (profile) => !likedCharacters.some((liked) => liked.id === profile.id)
      )
    );
  }, [likedCharacters]);

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
        data={[...loadedCharactersProfiles].reverse()}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <CharacterCard character={item} isCurrent={index === 0} />
        )}
      />
      {loadedCharactersProfiles.length > 0 && (
        <LikeButton
          characterId={
            loadedCharactersProfiles[1]?.id ?? loadedCharactersProfiles[0]?.id
          }
        />
      )}
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
