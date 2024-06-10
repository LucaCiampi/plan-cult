import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import {
  selectAllCharacters,
  selectLikedCharacters,
} from '@/slices/charactersSlice';
import { isNearUser } from '@/utils/distanceUtils';
import { useAnecdotes } from '@/hooks/useAnecdotes';
import {
  selectUserLocation,
  setUserLocation,
} from '@/slices/userLocationSlice';
import Config from '@/constants/Config';
import { formatMapMarkerDateTitle } from '@/utils/labellingUtils';
import AnecdoteCard from '@/components/map/AnecdoteCard';

export default function Map() {
  const dbService = useDatabaseService();
  const route = useRoute();
  const anecdotes = useAnecdotes();
  const dispatch = useDispatch();

  const userLocation = useSelector(selectUserLocation);
  const allCharacters = useSelector(selectAllCharacters);
  const likedCharacters = useSelector(selectLikedCharacters);

  const [markers, setMarkers] = useState<Landmark[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<
    Landmark | Anecdote | null
  >(null);
  const [presentationUserPositionIndex, setPresentationUserPositionIndex] =
    useState<number>(-1);

  const mapRef = useRef<MapView>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  /**
   * Positions utilisées pour la présentation
   */
  const [defaultUserLocations] = useState([
    {
      // Croix rousse centre
      latitude: 45.779706,
      longitude: 4.8273587,
    },
    // {
    //   // Centre, à côté de place des terreaux
    //   latitude: 45.766035,
    //   longitude: 4.833658,
    // },
    {
      // Mâchecroute
      latitude: 45.754,
      longitude: 4.8379504,
    },
  ]);

  useEffect(() => {
    const fetchAllLandmarks = async () => {
      const landmarks = await dbService.getAllLandmarks();

      setMarkers(landmarks);
    };
    void fetchAllLandmarks();
  }, []);

  useEffect(() => {
    if (route.params == null || markers.length === 0) return;

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

  const handleMarkerPress = useCallback(
    (marker: Landmark) => {
      setSelectedMarker(marker);
      bottomSheetRef.current?.snapToIndex(1); // Ouvre la BottomSheet au second snap point
    },
    [selectedMarker]
  );

  const handleAnecdotePress = useCallback(
    (anecdote: Anecdote) => {
      setSelectedMarker(anecdote);
      bottomSheetRef.current?.snapToIndex(1); // Ouvre la BottomSheet au second snap point
    },
    [selectedMarker]
  );

  const handleUserMarkerPress = useCallback(() => {
    if (Config.DEBUG) {
      const nextIndex = presentationUserPositionIndex + 1;

      if (nextIndex < defaultUserLocations.length) {
        setPresentationUserPositionIndex(nextIndex);
        dispatch(setUserLocation(defaultUserLocations[nextIndex]));
      } else {
        setPresentationUserPositionIndex(0);
        dispatch(setUserLocation(defaultUserLocations[0]));
      }
    }
  }, [presentationUserPositionIndex, dispatch, defaultUserLocations]);

  // Fonction pour fermer la carte
  const handleLandmarkClose = useCallback(() => {
    setSelectedMarker(null);
  }, []);

  const renderedMarkers = useMemo(() => {
    return markers
      .filter((marker) =>
        marker.characters.some((character) =>
          likedCharacters.some(
            (likedCharacter) => likedCharacter.id === character.id
          )
        )
      )
      .map((marker, index) => {
        return (
          <Marker
            key={index}
            coordinate={marker.coordinates}
            title={formatMapMarkerDateTitle(marker.characters[0])}
            onPress={() => {
              handleMarkerPress(marker);
            }}
          >
            {getPinFromType(
              selectedMarker?.id === marker.id ? 'date' : 'default'
            )}
          </Marker>
        );
      });
  }, [markers, selectedMarker, likedCharacters]);

  const renderedAnecdotes = useMemo(
    () =>
      anecdotes?.map((anecdote, index) => (
        <Marker
          key={index}
          coordinate={anecdote.coordinates}
          title={anecdote.title}
          onPress={() => {
            handleAnecdotePress(anecdote);
          }}
        >
          {getPinFromType('anecdote')}
        </Marker>
      )),
    [anecdotes]
  );

  const renderedCharacters = useMemo(
    () =>
      allCharacters.map(
        (character, index) =>
          character.coordinates !== undefined && (
            <Marker
              key={index}
              coordinate={character.coordinates}
              title={`${character.name} ${character.surname ?? ''}`}
            >
              {getPinFromType(
                isNearUser(userLocation, character.coordinates)
                  ? 'characterGlasses'
                  : 'character'
              )}
            </Marker>
          )
      ),
    [allCharacters, userLocation]
  );

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
          {renderedMarkers}
          {renderedAnecdotes}
          {renderedCharacters}
          {userLocation !== null && (
            <>
              <Marker
                coordinate={{
                  latitude: userLocation.latitude,
                  longitude: userLocation.longitude,
                }}
                onPress={handleUserMarkerPress}
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
            {selectedMarker !== null && 'characters' in selectedMarker && (
              <LandmarkCard
                landmark={selectedMarker}
                onClose={handleLandmarkClose}
              />
            )}
            {selectedMarker !== null && 'title' in selectedMarker && (
              <AnecdoteCard anecdote={selectedMarker} />
            )}
          </BottomSheetView>
        </BottomSheet>
      </GestureHandlerRootView>
    );
  }

  /**
   * Version web
   */
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
          <h4>{formatMapMarkerDateTitle(marker.characters[0])}</h4>
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
          {selectedMarker !== null && 'characters' in selectedMarker && (
            <LandmarkCard
              landmark={selectedMarker}
              onClose={handleLandmarkClose}
            />
          )}
          {selectedMarker !== null && 'title' in selectedMarker && (
            <AnecdoteCard anecdote={selectedMarker} />
          )}
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
