import React, { useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { Platform, StyleSheet, View, Text } from 'react-native';
import cursorPinReference from '@/assets/images/icon.png';
import LandmarkCard from '@/components/LandmarkCard';

interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export default function Map() {
  const [markers] = useState<Landmark[]>([
    {
      id: 1,
      title: 'Marqueur 1',
      description: 'lorem ipsum',
      coordinates: {
        latlng: {
          latitude: 45.767135,
          longitude: 4.833658,
        },
      },
    },
    {
      id: 1,
      title: 'Marqueur 2',
      description: 'ma description',
      coordinates: {
        latlng: {
          latitude: 45.757,
          longitude: 4.83,
        },
      },
    },
    {
      id: 1,
      title: 'Marqueur 3',
      description: 'ma description',
      coordinates: {
        latlng: {
          latitude: 45.777,
          longitude: 4.83,
        },
      },
    },
  ]);

  const [region, setRegion] = useState<Region>({
    latitude: 45.767135,
    longitude: 4.833658,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [selectedMarker, setSelectedMarker] = useState<Landmark | null>(null);

  // Gestionnaire de changement de région
  const handleRegionChange = (newRegion: Region) => {
    setRegion(newRegion);
  };

  const handleMarkerPress = (marker: Landmark) => {
    setSelectedMarker(marker);
  };

  // Fonction pour fermer la carte
  const handleLandmarkClose = () => {
    setSelectedMarker(null);
  };

  if (Platform.OS !== 'web') {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          region={region}
          onRegionChange={handleRegionChange}
        >
          {markers.map((marker, index) => (
            <Marker
              key={index}
              coordinate={marker.coordinates.latlng}
              title={marker.title}
              image={cursorPinReference}
              onPress={() => {
                handleMarkerPress(marker);
              }}
            />
          ))}
          {/* <Overlay
            bounds={[
              [45.72, 4.8],
              [45.78, 4.87],
            ]}
            image={cursorPinReference}
          /> */}
        </MapView>
        <LandmarkCard onClose={handleLandmarkClose} landmark={selectedMarker} />
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
