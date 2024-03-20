import { View, Text } from "react-native";
import Button from "../components/common/Button";
import { AntDesign } from "@expo/vector-icons";

import { Link } from "expo-router";

export default function Page() {
  return (
    <View>
      <Text>Swipe</Text>
      <Button>Mon bouton</Button>
      <Link href="/map">Map</Link>
      <Link href="/swipe">Swipe</Link>
      <Link href="/chat">Chat</Link>
      <Link href="/">Index</Link>
    </View>
  );
}
