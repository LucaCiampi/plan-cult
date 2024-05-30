// LandmarkCard.tsx
import React, { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Button from '@/components/common/Button';
import { useDispatch } from 'react-redux';
import { increaseCharacterTrustLevel } from '@/slices/charactersSlice';
import { AppDispatch } from '@/app/store';
import Sizes from '@/constants/Sizes';
import Colors from '@/constants/Colors';
import DateDisclaimer from '@/components/map/DateDisclaimer';
import CharacterTag from '@/components/map/CharacterTag';
import { setCurrentQuestions } from '@/slices/chatSlice';
import { useDatabaseService } from '@/contexts/DatabaseServiceContext';
import { router } from 'expo-router';

interface LandmarkCardProps {
  landmark: Landmark | null;
  onClose: () => void;
}

const LandmarkCard: React.FC<LandmarkCardProps> = ({ landmark }) => {
  const dispatch = useDispatch<AppDispatch>();
  const experienceId = 1;
  const dbService = useDatabaseService();

  console.log('landmark', landmark);
  console.log('landmark?.characters[0]', landmark?.characters[0]);

  /**
   * Updates new questions according to trust level
   */
  const updateFollowingQuestions = useCallback(
    async (characterId: number, newTrustLevel: number) => {
      const followingQuestions = await dbService.getFirstDialoguesOfTrustLevel(
        characterId,
        newTrustLevel
      );

      const characterIdString = String(characterId);
      dispatch(
        setCurrentQuestions({
          characterId: characterIdString,
          questions: followingQuestions,
        })
      );
    },
    []
  );

  const handleClick = () => {
    // Dispatch de la thunk action en passant l'instance dbService
    if (landmark?.characters[0] !== undefined) {
      let newTrustLevel = 2;
      if (landmark?.characters[0].trust_level !== undefined) {
        newTrustLevel = landmark?.characters[0].trust_level + 1;
      }
      dispatch(
        increaseCharacterTrustLevel({
          characterId: landmark?.characters[0].id,
          // TODO: use trust level stored in DB
          newTrustLevel,
        })
      );
      void updateFollowingQuestions(landmark?.characters[0].id, newTrustLevel);
    }

    router.push({
      pathname: `/experience/${landmark?.experience.id}`,
    });
  };

  return (
    <View style={styles.card}>
      {/* <Image
        // TODO: manifestement les images fetchées ne sont pas celles en local
        source={{ uri: landmark?.thumbnail }}
        style={styles.landmarkMainPhoto}
      /> */}
      <Text style={styles.landmarkTitle}>
        Rencard avec {landmark?.characters[0]?.name}{' '}
        {landmark?.characters[0]?.surname}
      </Text>
      <Text style={styles.landmarkDescription}>{landmark?.description}</Text>

      <View style={styles.disclaimers}>
        <DateDisclaimer icon={'time'} text={'Durée 10 minutes'} />
        <DateDisclaimer icon={'sound'} text={'Nécessite des écouteurs'} />
      </View>

      {landmark?.characters[0] !== undefined && (
        <View style={styles.dateWith}>
          <Text style={styles.dateWithText}>Votre rencard avec :</Text>
          <CharacterTag character={landmark?.characters[0]} />
        </View>
      )}
      {landmark?.experience !== null && (
        <Button
          fontSize="large"
          color="orange"
          onPress={handleClick}
          style={styles.startButton}
        >
          J&apos;y suis !
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: Sizes.pageContentHorizontalMargin * 1.5,
    flex: 1,
    gap: Sizes.padding,
  },
  landmarkMainPhoto: {
    width: '100%',
    // TODO: auto aspect-ratio
    aspectRatio: 1,
    backgroundColor: Colors.grey,
  },
  landmarkTitle: {
    fontSize: 24,
  },
  landmarkDescription: {
    fontSize: 16,
  },
  disclaimers: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: Sizes.padding,
    gap: Sizes.padding * 2,
    justifyContent: 'space-between',
  },
  dateWith: {
    marginBottom: Sizes.padding * 4,
  },
  dateWithText: {
    fontWeight: 'bold',
    marginBottom: Sizes.padding,
  },
  startButton: {
    borderWidth: 0,
    marginHorizontal: 'auto',
  },
});

export default LandmarkCard;
