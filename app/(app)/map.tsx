import React, { useState, useCallback, useRef, useEffect } from 'react';
import MapView, { Marker, Circle } from 'react-native-maps';
import { Platform, StyleSheet, TouchableOpacity } from 'react-native';
import LandmarkCard from '@/components/map/LandmarkCard';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useRoute } from '@react-navigation/native';
import { useDatabaseService } from '@/contexts/DatabaseServiceContext';
import DefaultPin from '@/assets/images/map/pin.svg';
import UserPin from '@/assets/images/map/user.svg';
import AnecdotePin from '@/assets/images/map/anecdote.svg';
import AnecdoteSeenPin from '@/assets/images/map/anecdote-seen.svg';
import DatePin from '@/assets/images/map/date.svg';
import CharacterPin from '@/assets/images/map/character.svg';
import CharacterGlassesPin from '@/assets/images/map/character-glasses.svg';
import Colors from '@/constants/Colors';
import {
  initialRegionView,
  minDistanceToSwipeCharacter,
} from '@/constants/Coordinates';
import { customMapStyle } from '@/constants/Styles';
import { useSelector } from 'react-redux';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useUserLocation } from '@/hooks/useUserLocation';
import { selectAllCharacters } from '@/slices/charactersSlice';
import { isNearUser } from '@/utils/randomUtils';

export default function Map() {
  const dbService = useDatabaseService();
  const route = useRoute();

  // const { userLocation } = useUserLocation();
  const userLocation = {
    latitude: 45.767135,
    longitude: 4.833658,
  };

  const allCharacters = useSelector(selectAllCharacters);

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
    const landmarkId = route.params?.landmarkId;

    if (landmarkId != null) {
      const marker = markers.find((m) => m.id === Number(landmarkId));

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
        setTimeout(() => {
          bottomSheetRef.current?.snapToIndex(2); // Ouvre la BottomSheet au second snap point
        }, 2000);
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

  const isLandmark = (marker: Landmark | Character): marker is Landmark => {
    return (marker as Landmark).category !== undefined;
  };

  const isCharacter = (marker: Landmark | Character): marker is Character => {
    return (marker as Character).surname !== undefined;
  };

  const handleMarkerPress = (marker: Landmark | Character) => {
    if (isLandmark(marker)) {
      setSelectedMarker(marker);
      bottomSheetRef.current?.snapToIndex(1); // Ouvre la BottomSheet au second snap point
    } else if (isCharacter(marker)) {
      // setSelectedMarker(marker);
    }
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
        <MapView
          ref={mapRef}
          style={styles.map}
          region={initialRegionView}
          customMapStyle={customMapStyle}
          mapType="mutedStandard"
          showsPointsOfInterest={false}
        >
          {markers.map((marker, index) => (
            <Marker
              key={index}
              coordinate={marker.coordinates}
              title={`Rencard avec ${marker.characters[0]?.name} ${marker.characters[0]?.surname}`}
              // image={} // unused
              onPress={() => {
                handleMarkerPress(marker);
              }}
              // onDeselect={() => {
              //   handleMarkerDeselect(marker);
              // }}
            >
              {getPinFromType(
                selectedMarker?.id === marker.id ? 'date' : 'default'
              )}
              {/* {selectedMarker?.id === marker.id && (
                <Callout tooltip>
                  <View>
                    <Text>{marker.name}</Text>
                  </View>
                </Callout>
              )} */}
            </Marker>
          ))}
          {userLocation !== null && (
            <>
              <Marker
                coordinate={{
                  latitude: userLocation.latitude,
                  longitude: userLocation.longitude,
                }}
                title={'User'}
              >
                {getPinFromType('user')}
              </Marker>
              <Circle
                center={{
                  latitude: userLocation.latitude,
                  longitude: userLocation.longitude,
                }}
                radius={minDistanceToSwipeCharacter}
                fillColor={`${Colors.purple}4D`}
                strokeColor="#00000000"
              />
            </>
          )}
          {/* <Overlay
            bounds={[
              [45.72, 4.8],
              [45.78, 4.87],
            ]}
            image={cursorPin}
          /> */}
          {allCharacters.map(
            (character, index) =>
              character.coordinates !== undefined && (
                <Marker
                  key={index}
                  coordinate={character.coordinates}
                  title={character.name}
                  // image={} // unused
                  onPress={() => {
                    handleMarkerPress(character);
                  }}
                  // onDeselect={() => {
                  //   handleMarkerDeselect(character);
                  // }}
                >
                  {/* {getPinFromType(character.category)} */}
                  {getPinFromType(
                    isNearUser(userLocation, character.coordinates)
                      ? 'characterGlasses'
                      : 'character'
                  )}
                  {/* {selectedMarker?.id === character.id && (
                <Callout tooltip>
                  <View>
                    <Text>{character.name}</Text>
                  </View>
                </Callout>
              )} */}
                </Marker>
              )
          )}
        </MapView>
        <BottomSheet
          snapPoints={[36, 160, '100%']}
          ref={bottomSheetRef}
          onChange={handleSheetChanges}
          handleIndicatorStyle={{
            backgroundColor: Colors.orange,
            width: '20%',
          }}
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      {markers.map((marker) => (
        <TouchableOpacity
          style={styles.webMarker}
          key={marker.id}
          onPress={() => {
            setSelectedMarker(marker);
          }}
        >
          <h4>{marker.name}</h4>
        </TouchableOpacity>
      ))}
      {/* <Image
        source={mapBackgroundReference}
        style={styles.mapBackground}
      /> */}
      <BottomSheet
        // snapPoints={[36, 160, '100%']}
        snapPoints={[160, '100%']}
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

// Objet de mappage pour associer chaque catégorie de Landmark à sa référence d'image
const pinsByCategory: Record<PinCategory, any> = {
  default: DefaultPin,
  user: UserPin,
  anecdote: AnecdotePin,
  anecdoteSeen: AnecdoteSeenPin,
  date: DatePin,
  character: CharacterPin,
  characterGlasses: CharacterGlassesPin,
};

// Fonction pour obtenir la référence d'image en fonction de la catégorie du repère
function getPinFromType(category: PinCategory): any {
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
  webMarker: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#aaa',
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
  },
});
