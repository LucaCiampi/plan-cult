// _layout.tsx
import { useFonts } from 'expo-font';
import { Slot, SplashScreen } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import { DatabaseServiceProvider } from '@/contexts/DatabaseServiceContext';
import { ThemeProvider } from '@react-navigation/native';
import { useColorScheme, ImageBackground, StyleSheet } from 'react-native';
import backgroundLightReference from '@/assets/images/background-light.jpg';
import backgroundDarkReference from '@/assets/images/background-dark.jpg';
import { customDarkTheme, customLightTheme } from '@/constants/Themes';

void SplashScreen.preventAutoHideAsync();
export default function AppLayout() {
  const [currentTheme, setCurrentTheme] = useState(customLightTheme);
  const [loaded, error] = useFonts({
    RobotoLight: require('@/assets/fonts/Roboto-Light.ttf'),
    ITCAvantGardeMd: require('@/assets/fonts/ITCAvantGardeStd-Md.otf'),
  });
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (error != null) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      getDeviceColorScheme();
      void SplashScreen.hideAsync();
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
