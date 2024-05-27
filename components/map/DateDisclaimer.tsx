// LandmarkCard.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Colors from '@/constants/Colors';
import TimerIcon from '@/assets/images/map/timer.svg';
import SoundIcon from '@/assets/images/map/sound.svg';
import Sizes from '@/constants/Sizes';

interface DateDisclaimerProps {
  icon: 'time' | 'sound';
  text: string;
}

const iconByKind: Record<any, any> = {
  time: TimerIcon,
  sound: SoundIcon,
};

function getIconByKind(icon: string) {
  const IconComponent =
    iconByKind[icon] !== null ? iconByKind[icon] : TimerIcon;
  return <IconComponent style={styles.disclaimerIcon} />;
}

const DateDisclaimer: React.FC<DateDisclaimerProps> = ({ icon, text }) => {
  return (
    <View style={styles.disclaimer}>
      {getIconByKind(icon)}
      <Text style={styles.disclaimerText}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 120,
  },
  disclaimerIcon: {
    marginRight: Sizes.padding,
  },
  disclaimerText: {
    color: Colors.purple,
    fontWeight: 'bold',
  },
});

export default DateDisclaimer;
