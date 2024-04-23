import Colors from '@/constants/Colors';
import React from 'react';
import { StyleSheet, Image, View, ImageStyle } from 'react-native';

interface Props {
  src?: string;
  size?: 'mini' | 'medium';
  style?: ImageStyle;
}

const Avatar = ({ src, size = 'mini', style, ...rest }: Props) => {
  const sizeStyle = styles[size]; // Sélectionne dynamiquement le style basé sur la prop `size`

  if (src === null) {
    return <View style={[style, styles.avatar, sizeStyle]} {...rest}></View>;
  }
  return (
    <Image
      source={{ uri: src }}
      style={[style, styles.avatar, sizeStyle]}
      {...rest}
    />
  );
};

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: Colors.grey,
    borderRadius: 9999,
  },
  mini: {
    height: 34,
    width: 34,
  },
  medium: {
    height: 50,
    width: 50,
  },
});

export default Avatar;
