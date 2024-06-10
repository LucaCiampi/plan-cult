import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';

export default function NotificationsHandler() {
  //   const { expoPushToken, channels } = usePushNotifications();
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log('Notification received: ', notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log('Notification response received: ', response);
      });

    return () => {
      if (notificationListener.current !== undefined) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current !== undefined) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return null;
}
