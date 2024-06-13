import { Stack } from 'expo-router';
import { View, Text } from 'react-native';

export default function Page() {
  return (
    <View>
      <Stack.Screen
        options={{
          headerTitle: "Le dico'",
        }}
      />
      <Text>Profile</Text>
    </View>
  );
}
