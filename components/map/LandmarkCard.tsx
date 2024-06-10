// LandmarkCard.tsx
import React, { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Button from '@/components/common/Button';
import { router } from 'expo-router';
import { useDispatch } from 'react-redux';
import { increaseTrustAndFetchQuestions } from '@/slices/charactersSlice';
import { AppDispatch } from '@/app/store';
import Sizes from '@/constants/Sizes';
import Colors from '@/constants/Colors';
import DateDisclaimer from '@/components/map/DateDisclaimer';
import CharacterTag from '@/components/map/CharacterTag';
import { formatMapMarkerDateTitle } from '@/utils/labellingUtils';

interface LandmarkCardProps {
  landmark: Landmark;
  onClose: () => void;
}

const LandmarkCard: React.FC<LandmarkCardProps> = ({ landmark }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleClick = useCallback(() => {
    // Dispatch de la thunk action en passant l'instance dbService
    if (landmark.characters[0] !== undefined) {
      const characterId = landmark.characters[0].id;
      void dispatch(increaseTrustAndFetchQuestions({ characterId }));
    }

    router.push({
      pathname: `/experience/${landmark.experience.id}`,
    });
  }, [landmark]);

  return (
    <View style={styles.card}>
      {/* <Image
        // TODO: manifestement les images fetchées ne sont pas celles en local
        source={{ uri: landmark.thumbnail }}
        style={styles.landmarkMainPhoto}
      /> */}
      <Text style={styles.landmarkTitle}>
        {formatMapMarkerDateTitle(landmark.characters[0])}
      </Text>
      <Text style={styles.landmarkDescription}>{landmark.description}</Text>

      <View style={styles.disclaimers}>
        <DateDisclaimer icon={'time'} text={'Durée 10 minutes'} />
        <DateDisclaimer icon={'sound'} text={'Nécessite des écouteurs'} />
      </View>

      {landmark.characters[0] !== undefined && (
        <View style={styles.dateWith}>
          <Text style={styles.dateWithText}>Votre rencard avec :</Text>
          <CharacterTag character={landmark.characters[0]} />
        </View>
      )}
      {landmark.experience !== null && (
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
