// LandmarkCard.tsx
import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import Button from './common/Button';
import { useDispatch } from 'react-redux';
import { increaseTrustLevel } from '@/slices/charactersSlice';
import { useDatabaseService } from '@/contexts/DatabaseServiceContext';
import { AppDispatch } from '@/app/store';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Sizes from '@/constants/Sizes';

interface LandmarkCardProps {
  landmark: Landmark | null;
  onClose: () => void;
}

const LandmarkCard: React.FC<LandmarkCardProps> = ({ landmark, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const dbService = useDatabaseService();

  const handleClick = () => {
    // Dispatch de la thunk action en passant l'instance dbService
    void dispatch(increaseTrustLevel({ characterId: 4, dbService }));
  };

  return (
    <View style={styles.card}>
      <Image
        // TODO: manifestement les images fetchées ne sont pas celles en local
        source={{ uri: landmark?.thumbnail }}
        style={styles.landmarkMainPhoto}
      />
      <Text style={styles.landmarkTitle}>{landmark?.name}</Text>
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
    flex: 1,
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
