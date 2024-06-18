import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
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
import { Stack } from 'expo-router';
import NoResultsMoveImage from '@/assets/images/no-results/move.png';
import NoResultsOupsImage from '@/assets/images/no-results/oups.png';
import Sizes from '@/constants/Sizes';
import HeartAnim from '@/assets/images/heart-anim.gif';

export default function SwipePage() {
  const [charactersNearbyNotLiked, setCharactersNearbyNotLiked] = useState<
    Character[]
  >([]);
  const [loadedCharactersProfiles, setLoadedCharactersProfiles] = useState<
    Character[]
  >([]);
  const [displayedCharactersProfiles, setDisplayedCharactersProfiles] =
    useState<Character[]>([]);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const dbService = useDatabaseService();

  // Récupération de la position de l'utilisateur depuis Redux
  const userLocation = useSelector(selectUserLocation);

  // Récupération des profils likés depuis Redux
  const allCharacters = useSelector(selectAllCharacters);
  const likedCharacters = useSelector(selectLikedCharacters);

  /**
   * Lance l'animation de coeurs au like
   */
  const likeButtonAnimation = useCallback(() => {
    setShowHeartAnimation(true); // Affiche l'image temporairement
    setTimeout(() => {
      setShowHeartAnimation(false); // Masque l'image après 1 seconde
    }, 2800);
  }, []);

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
      setLoadedCharactersProfiles(newProfiles);
    } else {
      setLoadedCharactersProfiles([]);
    }
  }, [charactersNearbyNotLiked, dbService]);

  /**
   * Si les personnages à proximité changent,
   * on charge les nouveaux profils
   */
  useEffect(() => {
    void loadCharacterProfiles();
  }, [charactersNearbyNotLiked]);

  /**
   * On assure une distinction entre les profils chargés et affichés
   * de sorte à mettre l'animation de like
   * et à gérer correctement les affichages
   */
  useEffect(() => {
    void (async () => {
      showHeartAnimation &&
        (await new Promise((resolve) => setTimeout(resolve, 3000)));
      setDisplayedCharactersProfiles(loadedCharactersProfiles.reverse());
    })();
  }, [loadedCharactersProfiles]);

  /**
   * Met à jour loadedCharactersProfiles lorsque les profils likés changent
   */
  useEffect(() => {
    setLoadedCharactersProfiles((prevProfiles) =>
      prevProfiles.filter(
        (profile) => !likedCharacters.some((liked) => liked.id === profile.id)
      )
    );
  }, [likedCharacters]);

  if (displayedCharactersProfiles.length === 0) {
    return (
      <View style={styles.centeredContainer}>
        <Stack.Screen
          options={{
            headerTitle: 'Profils à proximité',
          }}
        />
        <Image
          style={styles.moveMessage}
          contentFit="contain"
          source={NoResultsMoveImage}
        />
        <Image
          style={styles.oupsMessage}
          contentFit="contain"
          source={NoResultsOupsImage}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: 'Profils à proximité',
        }}
      />
      <FlatList
        data={displayedCharactersProfiles}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <CharacterCard character={item} isCurrent={index === 0} />
        )}
      />
      {displayedCharactersProfiles.length > 0 && (
        <LikeButton
          handleLikeButtonPress={likeButtonAnimation}
          characterId={displayedCharactersProfiles[0]?.id}
        />
      )}
      {showHeartAnimation && (
        <Image
          style={{ width: 400, height: 400, position: 'absolute', zIndex: 5 }}
          contentFit="cover"
          source={HeartAnim}
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
  oupsMessage: {
    position: 'absolute',
    width: 325,
    height: 274,
    top: Sizes.padding,
    left: -Sizes.padding,
  },
  moveMessage: {
    position: 'absolute',
    zIndex: 2,
    width: 320,
    height: 310,
    right: -Sizes.padding,
    bottom: Sizes.padding * 2,
  },
});
