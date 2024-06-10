// _layout.tsx
import { useFonts } from 'expo-font';
import { Slot, SplashScreen } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { createStore } from '@/app/store';
import {
  DatabaseServiceProvider,
  useDatabaseService,
} from '@/contexts/DatabaseServiceContext';
import { ThemeProvider } from '@react-navigation/native';
import { useColorScheme, ImageBackground, StyleSheet } from 'react-native';
import backgroundLightReference from '@/assets/images/background-light.jpg';
import backgroundDarkReference from '@/assets/images/background-dark.jpg';
import { customDarkTheme, customLightTheme } from '@/constants/Themes';
import { UserLocationTracker } from '@/components/utilities/UserLocationTracker';
import NotificationsHandler from '@/components/utilities/NotificationsHandler';

void SplashScreen.preventAutoHideAsync();
export default function AppLayout() {
  const dbService = useDatabaseService();
  const store = createStore(dbService);
  const [currentTheme, setCurrentTheme] = useState(customLightTheme);
  const colorScheme = useColorScheme();
  const [loaded, error] = useFonts({
    ITCAvantGardeMd: require('@/assets/fonts/ITCAvantGardeStd-Md.otf'),
  });

  useEffect(() => {
    if (error != null) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      getDeviceColorScheme();
      void SplashScreen.hideAsync();

      // TODO
      // void registerForPushNotificationsAsync();
    }
  }, [loaded]);

  const getDeviceColorScheme = useCallback(() => {
    if (colorScheme === 'dark') {
      setCurrentTheme(customDarkTheme);
    } else {
      setCurrentTheme(customLightTheme);
    }
  }, [colorScheme]);

  if (!loaded) return null;

  return (
    <Provider store={store}>
      <ThemeProvider value={currentTheme}>
        <DatabaseServiceProvider>
          <ImageBackground
            source={
              colorScheme === 'dark'
                ? backgroundDarkReference
                : backgroundLightReference
            }
            resizeMode="cover"
            style={styles.backgroundImage}
          >
            <UserLocationTracker />
            <NotificationsHandler />
            <Slot />
          </ImageBackground>
        </DatabaseServiceProvider>
      </ThemeProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    fontFamily: 'ITCAvantGardeMd',
  },
});
