import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function ChatWithCharacterPage() {
  const { id } = useLocalSearchParams();

  return (
    <View>
      <Text>Chat avec character {id}</Text>
    </View>
  );
}
