import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import Button from './common/Button';

interface LandmarkCardProps {
  landmark: Landmark | null;
  onClose: () => void;
}

const LandmarkCard: React.FC<LandmarkCardProps> = ({ landmark, onClose }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.landmarkTitle}>{landmark?.name}</Text>
      <Text style={styles.landmarkDescription}>{landmark?.description}</Text>
      <Image
        // TODO: manifestement les images fetchées ne sont pas celles en local
        source={{ uri: landmark?.thumbnail }}
        style={{ width: 100, height: 100 }}
      />
      <Button
        onPress={() => {
          console.log('ok');
        }}
      >
        Coucou
      </Button>
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
