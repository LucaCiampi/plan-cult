import { Stack } from 'expo-router';
import { View, Text } from 'react-native';

export default function Page() {
  return (
    <View>
      <Stack.Screen
        options={{
          headerShown: false,
          presentation: 'transparentModal',
          contentStyle: {
            backgroundColor: 'transparent',
          },
        }}
      />
      <Text>Profile</Text>
    </View>
  );
}
