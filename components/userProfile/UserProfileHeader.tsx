// UserProfileHeader.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Sizes from '@/constants/Sizes';
import Avatar from '@/components/common/Avatar';
import SettingsIcon from '@/assets/images/settings.svg';
import KeyNumber from '@/components/userProfile/KeyNumber';
import Colors from '@/constants/Colors';
import { useSelector } from 'react-redux';
import { selectLikedCharacters } from '@/slices/charactersSlice';

const UserProfileHeader = () => {
  const likedCharactersNumber = useSelector(selectLikedCharacters).length;

  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <Avatar size="medium" isUser />
        <View style={styles.name}>
          <Text style={styles.userName}>Lucie</Text>
          <Text style={styles.userSurname}>Deschamps</Text>
        </View>
        <SettingsIcon />
      </View>
      <View style={styles.stats}>
        <KeyNumber
          number={likedCharactersNumber}
          text="Personnages débloqués"
        />
        <KeyNumber number={likedCharactersNumber * 2} text="Messages envoyés" />
        <KeyNumber number={1} text="Rencard effectué" />
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
