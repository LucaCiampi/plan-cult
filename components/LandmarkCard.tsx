import Colors from '@/constants/Colors';
import React, { useEffect, useRef } from 'react';
import { Animated, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface LandmarkCardProps {
  landmark: Landmark | null;
  onClose: () => void;
}

const LandmarkCard: React.FC<LandmarkCardProps> = ({ landmark, onClose }) => {
  const translateY = useRef(new Animated.Value(100)).current; // Commence caché

  useEffect(() => {
    if (landmark != null) {
      // Si landmark n'est pas null, animer l'entrée
      Animated.spring(translateY, {
        toValue: 0, // Déplacer vers sa position visible
        useNativeDriver: true,
      }).start();
    } else {
      // Si landmark est null, animer la sortie avant de cesser le rendu
      Animated.spring(translateY, {
        toValue: 100, // Déplacer hors de l'écran
        useNativeDriver: true,
      }).start();
    }
  }, [landmark, translateY]);

  return (
    <Animated.View style={[styles.card, { transform: [{ translateY }] }]}>
      <Text>{landmark?.title}</Text>
      <Text>{landmark?.description}</Text>
      <TouchableOpacity onPress={onClose}>
        <Text>X</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background,
    padding: 12,
  },
});

export default LandmarkCard;
