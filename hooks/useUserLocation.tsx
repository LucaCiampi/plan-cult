import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as Location from 'expo-location';
import * as Device from 'expo-device';
import Config from '@/constants/Config';

interface UseUserLocationResult {
  userLocation: Coordinates;
  errorMsg: string | null;
  locationText: string;
}

export function useUserLocation(): UseUserLocationResult {
  console.log('🪝 useUserLocation');

  // TODO: permettre une valeur nulle, auquel cas il faut trouver une solution
  const [userLocation, setUserLocation] = useState<Coordinates>({
    latitude: 45.754,
    longitude: 4.8379504,
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [locationText, setLocationText] = useState<string>('Waiting..');

  useEffect(() => {
    void (async () => {
      if (Platform.OS === 'android' && !Device.isDevice) {
        setErrorMsg(
          'Oops, this will not work on Snack in an Android Emulator. Try it on your device!'
        );
        return;
      }
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access userLocation was denied');
        return;
      }

      if (!Config.DEBUG) {
        void Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 10000, // Update every 10 seconds
            distanceInterval: 10, // Update every 10 meters
          },
          (newLocation) => {
            setUserLocation(newLocation.coords);
          }
        );
      }
    })();
  }, []);

  useEffect(() => {
    let text = 'Waiting..';
    if (errorMsg !== null) {
      text = errorMsg;
    } else if (userLocation !== null) {
      text = `Latitude: ${userLocation.latitude}, Longitude: ${userLocation.longitude}`;
    }
    setLocationText(text);
    console.log('🚶 userLocation : ', text);
  }, [userLocation, errorMsg]);

  return { userLocation, errorMsg, locationText };
}
