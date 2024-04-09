import React, { useState, useCallback, useRef } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { Platform, StyleSheet, View, Text } from 'react-native';
import cursorPinReference from '@/assets/images/icon.png';
import LandmarkCard from '@/components/LandmarkCard';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export default function Map() {
  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

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

  // TODO: don't use useState
  const [region] = useState<Region>({
    latitude: 45.767135,
    longitude: 4.833658,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [selectedMarker, setSelectedMarker] = useState<Landmark | null>(null);

  const handleMarkerPress = (marker: Landmark) => {
    setSelectedMarker(marker);
    bottomSheetRef.current?.snapToIndex(1); // Ouvre la BottomSheet au second snap point
  };

  // Fonction pour fermer la carte
  const handleLandmarkClose = () => {
    setSelectedMarker(null);
  };

  if (Platform.OS !== 'web') {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <MapView style={styles.map} region={region}>
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
        <BottomSheet
          snapPoints={[36, 160, '100%']}
          ref={bottomSheetRef}
          onChange={handleSheetChanges}
        >
          {/* TODO: remove BottomSheetView ? */}
          <BottomSheetView style={styles.contentContainer}>
            <LandmarkCard
              landmark={selectedMarker}
              onClose={handleLandmarkClose}
            />
          </BottomSheetView>
        </BottomSheet>
      </GestureHandlerRootView>
    );
  }

  return (
    <View style={styles.centeredContainer}>
      <Text>La carte n&apos;est pas encore dispo sur navigateur</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
});
