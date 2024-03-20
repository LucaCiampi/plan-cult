import { View, Text } from "react-native";
import { Link } from "expo-router";
import CounterComponent from "@/features/counter/CounterComponent";

export default function Page() {
  return (
    <View>
      <Text>Index / onboarding</Text>
      <Link href="/map">Map</Link>
      <Link href="/">Swipe</Link>
      <Link href="/chat">Chat</Link>
      <CounterComponent />
    </View>
  );
}
