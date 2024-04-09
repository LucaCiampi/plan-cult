import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface LandmarkCardProps {
  landmark: Landmark | null;
  onClose: () => void;
}

const LandmarkCard: React.FC<LandmarkCardProps> = ({ landmark, onClose }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.landmarkTitle}>{landmark?.title}</Text>
      <Text style={styles.landmarkDescription}>{landmark?.description}</Text>
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
