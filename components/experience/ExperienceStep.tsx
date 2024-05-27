// ExperienceStep.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Sizes from '@/constants/Sizes';
import Colors from '@/constants/Colors';
import Avatar from '@/components/common/Avatar';

interface ExperienceStepProps {
  experienceStep: ExperienceStep;
}

const ExperienceStep: React.FC<ExperienceStepProps> = ({ experienceStep }) => {
  return (
    <View style={styles.nameContainer}>
      <Avatar size="large" src={experienceStep.image} />
      <Text style={styles.name}>{experienceStep.title}</Text>
      <Text style={styles.name}>{experienceStep.text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  nameContainer: {
    backgroundColor: Colors.black,
    padding: 4,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizes.padding,
  },
  name: {
    fontSize: Sizes.subtitleFontSize,
    color: Colors.white,
    fontWeight: 'bold',
  },
});

export default ExperienceStep;
