import Colors from '@/constants/Colors';
import Sizes from '@/constants/Sizes';
import React from 'react';
import { Text, StyleSheet, Pressable, PressableProps } from 'react-native';

interface Props extends PressableProps {
  children?: React.ReactNode;
}

const Button = ({ children, style, ...rest }: Props) => (
  <Pressable style={StyleSheet.flatten([styles.button, style])} {...rest}>
    <Text style={styles.text}>{children}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: Colors.purple,
  },
  text: {
    fontSize: Sizes.regularFontSize,
    lineHeight: Sizes.regularFontSize,
    color: Colors.lightBeige,
  },
});

export default Button;
