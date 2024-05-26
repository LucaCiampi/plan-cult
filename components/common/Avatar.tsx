import Colors from '@/constants/Colors';
import React from 'react';
import { StyleSheet, Image, View, ImageStyle } from 'react-native';
import defaultUserAvatar from '@/assets/images/user.jpg';

interface Props {
  src?: string;
  size?: 'mini' | 'medium' | 'large';
  isUser?: boolean; // TODO: remove this
  style?: ImageStyle;
}

const Avatar = ({ src, size = 'mini', isUser, style, ...rest }: Props) => {
  const sizeStyle = styles[size]; // Sélectionne dynamiquement le style basé sur la prop `size`

  if (src === null || (src !== undefined && src.length <= 1)) {
    return <View style={[style, styles.avatar, sizeStyle]} {...rest}></View>;
  } else if (isUser === true) {
    return (
      <Image
        source={defaultUserAvatar}
        style={[style, styles.avatar, sizeStyle]}
        {...rest}
      />
    );
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
  large: {
    height: 72,
    width: 72,
  },
});

export default Avatar;
