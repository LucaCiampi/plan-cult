import { View, Text } from "react-native";
import Button from "../components/Button";
import { AntDesign } from "@expo/vector-icons";

import { Link } from "expo-router";

export default function Page() {
  return (
    <View>
      <Text>Swipe</Text>
      <Button>Mon bouton</Button>
      <Link href="/about">Map</Link>
      <Link href="/">Swipe</Link>
      <Link href="/chat">Chat</Link>
    </View>
  );
}
