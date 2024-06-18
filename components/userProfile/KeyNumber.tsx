// KeyNumber.tsx
import Colors from '@/constants/Colors';
import Sizes from '@/constants/Sizes';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  number: number;
  text: string;
  link?: string;
}

const KeyNumber = ({ number, text, link }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.number}>{number}</Text>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 'auto',
  },
  number: {
    textAlign: 'center',
    color: Colors.orange,
    fontFamily: 'FreightSansProMediumBold',
    fontSize: Sizes.subtitleFontSize,
  },
  text: {
    textAlign: 'center',
    fontFamily: 'FreightSansProMediumRegular',
  },
});

export default KeyNumber;
