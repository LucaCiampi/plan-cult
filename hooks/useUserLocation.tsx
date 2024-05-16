import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as Location from 'expo-location';
import * as Device from 'expo-device';

interface LocationData {
  coords: {
    latitude: number;
    longitude: number;
    altitude: number | null;
    accuracy: number | null;
    altitudeAccuracy: number | null;
    heading: number | null;
    speed: number | null;
  };
  timestamp: number;
}

interface UseUserLocationResult {
  location: LocationData | null;
  errorMsg: string | null;
  locationText: string;
}

export function useUserLocation(): UseUserLocationResult {
  const [location, setLocation] = useState<LocationData | null>(null);
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

      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  useEffect(() => {
    let text = 'Waiting..';
    if (errorMsg !== null) {
      text = errorMsg;
    } else if (location !== null) {
      text = `Latitude: ${location.coords.latitude}, Longitude: ${location.coords.longitude}`;
    }
    setLocationText(text);
    console.log('👺 location : ', text);
  }, [location, errorMsg]);

  return { location, errorMsg, locationText };
}
