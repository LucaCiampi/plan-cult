import Colors from '@/constants/Colors';
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
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'black',
  },
});

export default Button;
