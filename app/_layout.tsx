// _layout.tsx
import { Tabs } from 'expo-router/tabs';
import Colors from '@/constants/Colors';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import { DatabaseServiceProvider } from '@/contexts/DatabaseServiceContext';
import { ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from 'react-native';

const customDarkTheme = {
  dark: true,
  colors: {
    primary: Colors.purple,
    background: Colors.darkGrey,
    card: Colors.black,
    text: Colors.white,
    border: Colors.black,
    notification: Colors.white,
    highlight: Colors.orange,
  },
};

const customLightTheme = {
  dark: false,
  colors: {
    primary: Colors.purple,
    background: Colors.beige,
    card: Colors.lightBeige,
    text: Colors.darkGrey,
    border: Colors.darkGrey,
    notification: Colors.darkGrey,
    highlight: Colors.purple,
  },
};

void SplashScreen.preventAutoHideAsync();
export default function AppLayout() {
  const [currentTheme, setCurrentTheme] = useState(customLightTheme);
  const [loaded, error] = useFonts({
    RobotoLight: require('@/assets/fonts/Roboto-Light.ttf'),
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
          <Tabs
            screenOptions={{
              tabBarActiveTintColor: Colors.purple,
              tabBarLabelStyle: {
                fontFamily: 'RobotoLight',
              },
            }}
          >
            <Tabs.Screen
              name="map"
              options={{
                title: 'Map',
                tabBarIcon: () => (
                  <FontAwesome5
                    name="map-marked-alt"
                    size={24}
                    color={currentTheme.colors.text}
                  />
                ),
              }}
            />
            <Tabs.Screen
              name="swipe"
              options={{
                title: 'Swipe',
                tabBarIcon: () => (
                  <MaterialIcons
                    name="swipe"
                    size={24}
                    color={currentTheme.colors.text}
                  />
                ),
              }}
            />
            <Tabs.Screen
              name="chat"
              options={{
                title: 'Chat',
                tabBarIcon: () => (
                  <Ionicons
                    name="chatbubble"
                    size={24}
                    color={currentTheme.colors.text}
                  />
                ),
              }}
            />
            <Tabs.Screen
              name="profile"
              options={{
                title: 'Profil',
                tabBarIcon: () => (
                  <Ionicons
                    name="person"
                    size={24}
                    color={currentTheme.colors.text}
                  />
                ),
              }}
            />
            <Tabs.Screen
              // Name of the route to hide.
              name="index"
              options={{
                // This tab will no longer show up in the tab bar.
                href: null,
              }}
            />
          </Tabs>
        </DatabaseServiceProvider>
      </ThemeProvider>
    </Provider>
  );
}
