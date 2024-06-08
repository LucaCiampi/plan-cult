import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as Location from 'expo-location';
import * as Device from 'expo-device';

interface UseUserLocationResult {
  location: Location.LocationObjectCoords | null;
  errorMsg: string | null;
  locationText: string;
}

export function useUserLocation(): UseUserLocationResult {
  console.log('🪝 useUserLocation');

  const [location, setLocation] =
    useState<Location.LocationObjectCoords | null>(null);
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
        setErrorMsg('Permission to access location was denied');
        return;
      }

      void Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 10000, // Update every 10 seconds
          distanceInterval: 10, // Update every 10 meters
        },
        (newLocation) => {
          setLocation(newLocation.coords);
        }
      );
    })();
  }, []);

  useEffect(() => {
    let text = 'Waiting..';
    if (errorMsg !== null) {
      text = errorMsg;
    } else if (location !== null) {
      text = `Latitude: ${location.latitude}, Longitude: ${location.longitude}`;
    }
    setLocationText(text);
    console.log('🚶 location : ', text);
  }, [location, errorMsg]);

  return { location, errorMsg, locationText };
}
