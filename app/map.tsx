import React, { useState, useCallback, useRef, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { Platform, StyleSheet, View, Text } from 'react-native';
import LandmarkCard from '@/components/LandmarkCard';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useRoute } from '@react-navigation/native';
import { useDatabaseService } from '@/contexts/DatabaseServiceContext';
import DefaultPin from '@/assets/images/map/default.svg';
import CulturePin from '@/assets/images/map/culture.svg';
import FoodPin from '@/assets/images/map/food.svg';
import MuseumPin from '@/assets/images/map/museum.svg';

interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export default function Map() {
  const dbService = useDatabaseService();
  const route = useRoute();

  // TODO: don't use useState
  const [initialRegionView] = useState<Region>({
    latitude: 45.767135,
    longitude: 4.833658,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [markers, setMarkers] = useState<Landmark[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<Landmark | null>(null);

  const mapRef = useRef<MapView>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    const fetchAllLandmarks = async () => {
      const landmarks = await dbService.getAllLandmarks();
      setMarkers(landmarks);
    };
    void fetchAllLandmarks();
  }, []);

  useEffect(() => {
    // @ts-expect-error: TODO: replace with redux rather than route param
    const landmarkId = route.params?.selectedLandmarkId;

    if (landmarkId != null) {
      const marker = markers.find((m) => m.id === landmarkId);

      if (marker != null) {
        setTimeout(() => {
          mapRef.current?.animateToRegion(
            {
              ...marker.coordinates,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            },
            1000
          );
          setSelectedMarker(marker);
        }, 1000);
      }
    }
  }, [route.params]);

  useEffect(() => {
    // Ouvre la BottomSheet au second snap point
    // bottomSheetRef.current?.snapToIndex(1);
  }, [selectedMarker]);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    // console.log('handleSheetChanges', index);
  }, []);

  const handleMarkerPress = (marker: Landmark) => {
    setSelectedMarker(marker);
    // bottomSheetRef.current?.expand();
    bottomSheetRef.current?.snapToIndex(1); // Ouvre la BottomSheet au second snap point
  };

  // const handleMarkerDeselect = (marker: Landmark) => {
  //   setSelectedMarker(null);
  //   bottomSheetRef.current?.collapse();
  // };

  // Fonction pour fermer la carte
  const handleLandmarkClose = () => {
    setSelectedMarker(null);
  };

  if (Platform.OS !== 'web') {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <MapView ref={mapRef} style={styles.map} region={initialRegionView}>
          {markers.map((marker, index) => (
            <Marker
              key={index}
              coordinate={marker.coordinates}
              title={marker.name}
              // image={} // unused
              onPress={() => {
                handleMarkerPress(marker);
              }}
              // onDeselect={() => {
              //   handleMarkerDeselect(marker);
              // }}
            >
              {getPinFromType(marker.category)}
              {/* {selectedMarker?.id === marker.id && (
                <Callout tooltip>
                  <View>
                    <Text>{marker.name}</Text>
                  </View>
                </Callout>
              )} */}
            </Marker>
          ))}
          {/* <Overlay
            bounds={[
              [45.72, 4.8],
              [45.78, 4.87],
            ]}
            image={cursorPin}
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

// Objet de mappage pour associer chaque catégorie de Landmark à sa référence d'image
const pinsByCategory: Record<LandmarkCategory, any> = {
  culture: CulturePin,
  museum: MuseumPin,
  food: FoodPin,
};

// Fonction pour obtenir la référence d'image en fonction de la catégorie du repère
function getPinFromType(category: LandmarkCategory): any {
  const PinComponent =
    pinsByCategory[category] !== null ? pinsByCategory[category] : DefaultPin;
  return <PinComponent style={styles.mapMarker} />;
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
  mapMarker: {
    maxHeight: 24,
    maxWidth: 24,
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
