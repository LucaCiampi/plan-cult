// LandmarkCard.tsx
import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import Button from '@/components/common/Button';
import { useDispatch } from 'react-redux';
import { increaseCharacterTrustLevel } from '@/slices/charactersSlice';
import { AppDispatch } from '@/app/store';
import Sizes from '@/constants/Sizes';
import Colors from '@/constants/Colors';

interface LandmarkCardProps {
  landmark: Landmark | null;
  onClose: () => void;
}

const LandmarkCard: React.FC<LandmarkCardProps> = ({ landmark, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleClick = () => {
    // Dispatch de la thunk action en passant l'instance dbService
    if (landmark?.characters[0] !== undefined) {
      dispatch(
        increaseCharacterTrustLevel({
          characterId: landmark?.characters[0].id,
          newTrustLevel: 2,
        })
      );
    }
  };

  return (
    <View style={styles.card}>
      <Image
        // TODO: manifestement les images fetchées ne sont pas celles en local
        source={{ uri: landmark?.thumbnail }}
        style={styles.landmarkMainPhoto}
      />
      <Text style={styles.landmarkTitle}>
        Rencard avec {landmark?.characters[0].name}{' '}
        {landmark?.characters[0].surname}
      </Text>
      <Text style={styles.landmarkDescription}>{landmark?.description}</Text>

      <Button onPress={handleClick}>J&apos;y suis</Button>
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
});

export default LandmarkCard;
