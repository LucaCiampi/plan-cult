import { useEffect, useState } from 'react';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

export function usePushNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>(
    undefined
  );
  const [channels, setChannels] = useState<Notifications.NotificationChannel[]>(
    []
  );

  useEffect(() => {
    async function registerForPushNotifications() {
      let token;

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
        const channels = await Notifications.getNotificationChannelsAsync();
        setChannels(channels ?? []);
      }

      if (Device.isDevice) {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          alert('Failed to get push token for push notification!');
          return;
        }
        try {
          const projectId =
            Constants?.expoConfig?.extra?.eas?.projectId ??
            Constants?.easConfig?.projectId;
          if (projectId === undefined) {
            throw new Error('Project ID not found');
          }
          token = (await Notifications.getExpoPushTokenAsync({ projectId }))
            .data;
          setExpoPushToken(token);
        } catch (e) {
          alert(`Error fetching push token: ${e as string}`);
        }
      } else {
        alert('Must use physical device for Push Notifications');
      }
    }

    void registerForPushNotifications();
  }, []);

  return { expoPushToken, channels };
}
