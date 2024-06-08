// UserLocationTracker.ts
import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as Location from 'expo-location';
import * as Device from 'expo-device';
import { useDispatch } from 'react-redux';
import { setUserLocation, setError } from '@/slices/userLocationSlice';
import Config from '@/constants/Config';

export const UserLocationTracker = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    void (async () => {
      if (Platform.OS === 'android' && !Device.isDevice) {
        dispatch(
          setError(
            'Oops, this will not work on Snack in an Android Emulator. Try it on your device!'
          )
        );
        return;
      }
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        dispatch(setError('Permission to access location was denied'));
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
            dispatch(setUserLocation(newLocation.coords));
          }
        );
      }
    })();
  }, [dispatch]);

  return null;
};
