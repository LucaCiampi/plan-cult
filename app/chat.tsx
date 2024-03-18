import { View, Text } from "react-native";

import { Link } from "expo-router";

export default function Page() {
  return (
    <View>
      <Text>Chat</Text>
      <Link href="/map">Map</Link>
      <Link href="/swipe">Swipe</Link>
      <Link href="/chat">Chat</Link>
      <Link href="/">Index</Link>
    </View>
  );
}
