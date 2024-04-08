// _layout.tsx
import { Tabs } from 'expo-router/tabs';
import Colors from '@/constants/Colors';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { useEffect } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { Provider } from 'react-redux';
import { store } from './store';
import {
  DatabaseServiceProvider,
  useDatabaseService,
} from '@/contexts/DatabaseServiceContext';

void SplashScreen.preventAutoHideAsync();
export default function AppLayout() {
  const dbService = useDatabaseService();

  const [loaded, error] = useFonts({
    RobotoLight: require('@/assets/fonts/Roboto-Light.ttf'),
  });

  useEffect(() => {
    void dbService.downloadCharactersData();
  }, []);

  useEffect(() => {
    if (error != null) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      void SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <DatabaseServiceProvider>
      <Provider store={store}>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: Colors.primary,
            tabBarLabelStyle: {
              fontFamily: 'RobotoLight',
            },
          }}
        >
          <Tabs.Screen
            name="map"
            options={{
              title: 'Map',
              tabBarIcon: ({ color }) => (
                <FontAwesome5 name="map-marked-alt" size={24} color="black" />
              ),
            }}
          />
          <Tabs.Screen
            name="swipe"
            options={{
              title: 'Swipe',
              tabBarIcon: ({ color }) => (
                <MaterialIcons name="swipe" size={24} color="black" />
              ),
            }}
          />
          <Tabs.Screen
            name="chat"
            options={{
              title: 'Chat',
              tabBarIcon: ({ color }) => (
                <Ionicons name="chatbubble" size={24} color="black" />
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
      </Provider>
    </DatabaseServiceProvider>
  );
}
