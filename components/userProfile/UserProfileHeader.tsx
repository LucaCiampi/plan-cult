// UserProfileHeader.tsx
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Sizes from '@/constants/Sizes';
import Avatar from '@/components/common/Avatar';
import SettingsIcon from '@/assets/images/settings.svg';
import KeyNumber from '@/components/userProfile/KeyNumber';
import Colors from '@/constants/Colors';
import { useDispatch, useSelector } from 'react-redux';
import { selectLikedCharacters } from '@/slices/charactersSlice';
import Config from '@/constants/Config';
import * as Location from 'expo-location';
import { setUserLocation } from '@/slices/userLocationSlice';

const UserProfileHeader = () => {
  const likedCharactersNumber = useSelector(selectLikedCharacters).length;
  const [isDebug, setIsDebug] = useState(Config.DEBUG);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('⚙️ Application now in ' + (isDebug ? 'debug' : 'production'));
    if (!isDebug) {
      void Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 10000, // Update every 10 seconds
          distanceInterval: 10, // Update every 10 meters
        },
        (newLocation) => {
          dispatch(setUserLocation(newLocation.coords));
        }
      );
    } else {
      dispatch(
        setUserLocation({
          // Pont Gallien
          latitude: 45.7507126,
          longitude: 4.8354594,
        })
      );
    }
  }, [isDebug]);

  const handleUserSettingsPress = () => {
    setIsDebug((prevIsDebug) => !prevIsDebug);
  };

  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <Avatar size="medium" isUser />
        <View style={styles.name}>
          <Text style={styles.userName}>Lucie</Text>
          <Text style={styles.userSurname}>Deschamps</Text>
        </View>
        <TouchableOpacity onPress={handleUserSettingsPress}>
          <SettingsIcon color={isDebug ? '#1A1A1A' : Colors.purple} />
        </TouchableOpacity>
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
