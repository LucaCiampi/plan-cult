// _layout.tsx
import { Tabs } from 'expo-router/tabs';
import Colors from '@/constants/Colors';
import { SplashScreen } from 'expo-router';
import { StyleSheet } from 'react-native';
import MapIcon from '@/assets/images/map.svg';
import SparklesIcon from '@/assets/images/sparkles.svg';
import MessageIcon from '@/assets/images/message.svg';
import ProfileIcon from '@/assets/images/profile.svg';

void SplashScreen.preventAutoHideAsync();
export default function AppLayout() {
  return (
    <Tabs
      sceneContainerStyle={styles.tabsBackground}
      screenOptions={{
        tabBarActiveTintColor: Colors.orange,
        tabBarInactiveTintColor: Colors.darkGrey,
        tabBarLabelStyle: {
          fontFamily: 'FreightSansProMediumRegular',
          display: 'flex',
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
          paddingBottom: 10,
        },
        tabBarStyle: {
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -1,
          },
          shadowOpacity: 0.25,
          shadowRadius: 6,
          borderTopWidth: 0,
          justifyContent: 'center',
        },
        headerStyle: {
          borderBottomWidth: 0,
          borderWidth: 0,
          borderColor: 'red',
          shadowColor: '#191919',
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.1,
          shadowRadius: 6,
        },
        headerTitleStyle: {
          fontFamily: 'FreightSansProMediumBold',
        },
      }}
    >
      <Tabs.Screen
        name="map"
        options={{
          title: 'Carte',
          tabBarIcon: ({ color }) => <MapIcon style={{ color }} />,
        }}
      />
      <Tabs.Screen
        name="swipe"
        options={{
          title: 'Match',
          tabBarIcon: ({ color }) => <SparklesIcon style={{ color }} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color }) => <MessageIcon style={{ color }} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => <ProfileIcon style={{ color }} />,
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
