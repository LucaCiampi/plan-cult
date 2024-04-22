// LandmarkCard.tsx
import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import Button from './common/Button';
import { useDispatch } from 'react-redux';
import { increaseTrustLevel } from '@/features/characters/charactersSlice';
import { useDatabaseService } from '@/contexts/DatabaseServiceContext';
import { AppDispatch } from '@/app/store'; // Assurez-vous que le chemin est correct

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
      <Text style={styles.landmarkTitle}>{landmark?.name}</Text>
      <Text style={styles.landmarkDescription}>{landmark?.description}</Text>
      <Image
        // TODO: manifestement les images fetchées ne sont pas celles en local
        source={{ uri: landmark?.thumbnail }}
        style={{ width: 100, height: 100 }}
      />

      <Button onPress={handleClick}>J&apos;y suis allé</Button>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    width: '100%',
    position: 'relative',
    padding: 12,
  },
  landmarkTitle: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 12,
  },
  landmarkDescription: {
    fontSize: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 12,
  },
});

export default LandmarkCard;
