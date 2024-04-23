// _layout.tsx
import { Tabs } from 'expo-router/tabs';
import Colors from '@/constants/Colors';
import { SplashScreen } from 'expo-router';
import { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';

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
  const [currentTheme] = useState(customLightTheme);

  return (
    <Tabs
      sceneContainerStyle={styles.tabsBackground}
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
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="map-marked-alt" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="swipe"
        options={{
          title: 'Swipe',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="swipe" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbubble" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabsBackground: {
    backgroundColor: 'transparent',
  },
});
