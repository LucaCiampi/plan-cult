// UserProfileButton.tsx
import Colors from '@/constants/Colors';
import Sizes from '@/constants/Sizes';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { ExpoRouter } from 'expo-router/types/expo-router';
import { Image, ImageSource } from 'expo-image';

interface Props {
  color?: 'orange' | 'purple' | 'none';
  isLarge?: boolean;
  text?: string;
  link?: string;
  image?: ImageSource;
}

const UserProfileButton = ({
  color = 'orange',
  isLarge,
  text,
  link,
  image,
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
      {text !== null && <Text style={styles.text}>{text}</Text>}
      {image !== null && (
        <Image source={image} style={styles.image} contentFit="cover" />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: Sizes.borderRadius,
    minHeight: 100,
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
    // flexBasis: 120,
    position: 'relative',
  },
  large: {
    // flexBasis: 240,
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
  none: {},
  image: {
    minWidth: '100%',
    minHeight: '100%',
  },
});

export default UserProfileButton;
