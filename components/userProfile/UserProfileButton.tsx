// UserProfileButton.tsx
import Colors from '@/constants/Colors';
import Sizes from '@/constants/Sizes';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  color?: 'orange' | 'purple';
  text: string;
  // link?: string;
}

const UserProfileButton = ({ color = 'orange', text }: Props) => {
  const colorStyle = styles[color]; // Sélectionne dynamiquement le style basé sur la prop `color`

  return (
    <View style={[styles.container, colorStyle]}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: Sizes.borderRadius,
    minHeight: 160,
    flexDirection: 'column',
    justifyContent: 'center',
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
