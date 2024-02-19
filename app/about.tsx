import { View, Text } from "react-native";

import { Link } from "expo-router";

export default function Page() {
  return (
    <View>
      <Text>About</Text>
      <Link href="/about">Map</Link>
      <Link href="/">Swipe</Link>
      <Link href="/chat">Chat</Link>
    </View>
  );
}
