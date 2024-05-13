import Colors from '@/constants/Colors';
import Sizes from '@/constants/Sizes';
import React from 'react';
import { Text, StyleSheet, Pressable, PressableProps } from 'react-native';

interface Props extends PressableProps {
  children?: React.ReactNode;
  color?: 'white' | 'orange';
}

const Button = ({ children, color = 'white', style, ...rest }: Props) => {
  const colorStyle = styles[color]; // Sélectionne dynamiquement le style basé sur la prop `color`

  return (
    <Pressable
      style={StyleSheet.flatten([styles.button, colorStyle, style])}
      {...rest}
    >
      <Text style={[styles.text, colorStyle]}>{children}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Sizes.padding / 2,
    paddingHorizontal: Sizes.padding,
    borderRadius: Sizes.buttonBorderRadius,
    elevation: 3,
    shadowColor: Colors.black,
    shadowRadius: 0,
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 1,
    borderWidth: 1,
    borderColor: Colors.darkGrey,
  },
  text: {
    fontSize: Sizes.regularFontSize,
    lineHeight: Sizes.regularFontSize,
    color: Colors.darkGrey,
  },
  white: {
    backgroundColor: Colors.white,
    color: Colors.darkGrey,
  },
  orange: {
    backgroundColor: Colors.orange,
  },
});

export default Button;
