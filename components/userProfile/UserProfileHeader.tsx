// UserProfileHeader.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Sizes from '@/constants/Sizes';
import Avatar from '@/components/common/Avatar';
import SettingsIcon from '@/assets/images/settings.svg';
import KeyNumber from '@/components/userProfile/KeyNumber';

const UserProfileHeader = () => {
  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <Avatar size="medium" isUser />
        <View style={styles.name}>
          <Text style={styles.userName}>Julie</Text>
          <Text style={styles.userSurname}>Deschamps</Text>
        </View>
        <SettingsIcon />
      </View>
      <View style={styles.stats}>
        <KeyNumber number={21} text="Personnages débloqués" />
        <KeyNumber number={21} text="Personnages débloqués" />
        <KeyNumber number={21} text="Personnages débloqués" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: Sizes.pageContentHorizontalMargin,
    backgroundColor: Colors.white,
    borderRadius: Sizes.borderRadius,
    gap: 24,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Sizes.padding,
  },
  name: {
    flexGrow: 1,
  },
  userName: {
    fontSize: 24,
  },
  userSurname: {
    fontSize: 16,
  },
  stats: {
    flexDirection: 'row',
  },
});

export default UserProfileHeader;
