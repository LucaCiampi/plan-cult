import React, { useRef, useEffect } from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface LandmarkCardProps {
  landmark: Landmark | null;
  onClose: () => void;
}

const LandmarkCard: React.FC<LandmarkCardProps> = ({ landmark, onClose }) => {
  const translateY = useRef(new Animated.Value(700)).current; // Commence caché, supposant 700 comme position initiale de 'aperçu'
  const lastY = useRef(700); // Mémoriser la dernière position Y de la carte pour gérer l'état d'aperçu

  // Définition d'un seuil pour déclencher l'expansion complète
  const EXPANSION_THRESHOLD = -100; // Nécessite un glissement de 100 pixels vers le haut pour déclencher l'expansion

  useEffect(() => {
    if (landmark != null) {
      // Animer vers l'aperçu plutôt que l'expansion complète
      Animated.spring(translateY, {
        toValue: 500, // Position de l'aperçu
        useNativeDriver: true,
      }).start();
      lastY.current = 500; // Mise à jour de la dernière position Y à l'aperçu
    }
  }, [landmark]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        // Calcul dynamique de la nouvelle position Y basée sur le mouvement
        let newY = lastY.current + gestureState.dy;
        newY = Math.min(Math.max(newY, 0), 700); // Contraindre newY entre 0 (complètement expandidée) et 700 (cachée)
        translateY.setValue(newY);
      },
      onPanResponderRelease: (_, gestureState) => {
        // Déterminer si l'utilisateur a glissé suffisamment vers le haut pour l'expansion
        const shouldExpand = gestureState.dy < EXPANSION_THRESHOLD;
        Animated.spring(translateY, {
          toValue: shouldExpand ? 0 : 500, // Revenir à l'aperçu si le geste n'indique pas une expansion
          useNativeDriver: true,
        }).start();

        lastY.current = shouldExpand ? 0 : 500; // Mise à jour de la dernière position Y
      },
    })
  ).current;

  return (
    <Animated.View
      style={[styles.card, { transform: [{ translateY }] }]}
      {...panResponder.panHandlers}
    >
      <View style={styles.draggableIndicator} />
      <Text>{landmark?.title}</Text>
      <TouchableOpacity
        onPress={() => {
          onClose();
          translateY.setValue(700); // Réinitialiser la position lors de la fermeture
          lastY.current = 700; // Réinitialiser à la position cachée
        }}
      >
        <Text>X</Text>
      </TouchableOpacity>
      {/* Le reste du contenu de la carte */}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'yellow',
    height: '100%', // Assurez-vous que cela fonctionne avec votre mise en page
  },
  draggableIndicator: {
    height: 5,
    backgroundColor: 'gray',
    width: 50,
    alignSelf: 'center',
    marginVertical: 8,
    borderRadius: 2.5,
  },
  //
});

export default LandmarkCard;
