// UserProfileButton.tsx
import Colors from '@/constants/Colors';
import Sizes from '@/constants/Sizes';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { ExpoRouter } from 'expo-router/types/expo-router';

interface Props {
  color?: 'orange' | 'purple';
  isLarge?: boolean;
  text: string;
  link?: string;
}

const UserProfileButton = ({
  color = 'orange',
  isLarge,
  text,
  link,
}: Props) => {
  const colorStyle = styles[color]; // Sélectionne dynamiquement le style basé sur la prop `color`

  const handlePress = () => {
    if (link !== null) {
      // Routes are static, this is a trick to pass route as prop
      router.push(link as ExpoRouter.Href);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.container, colorStyle, isLarge === true && styles.large]}
    >
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: Sizes.borderRadius,
    minHeight: 160,
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
    flexBasis: 120,
  },
  large: {
    flexBasis: 240,
  },
  text: {
    textAlign: 'center',
    color: Colors.white,
    fontWeight: 'bold',
  },
  orange: {
    backgroundColor: Colors.orange,
  },
  purple: {
    backgroundColor: Colors.purple,
  },
});

export default UserProfileButton;
