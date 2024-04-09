import React from 'react';
import MapView, { Marker } from 'react-native-maps';
import { Platform, StyleSheet, View, Text } from 'react-native';
import cursorPinReference from '@/assets/images/icon.png';

export default function Map() {
  const coords = {
    latitude: 45.767135,
    longitude: 4.833658,
  };

  if (Platform.OS !== 'web') {
    return (
      <View style={styles.container}>
        <MapView style={styles.map} />
        <Marker coordinate={coords} image={{ uri: cursorPinReference }} />
      </View>
    );
  }

  return (
    <View style={styles.centeredContainer}>
      <Text>La carte n&apos;est pas encore dispo sur navigateur</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
