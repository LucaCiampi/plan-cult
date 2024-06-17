import { useSelector } from 'react-redux';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import CharacterChatItem from '@/components/characters/CharacterChatItem';
import { selectLikedCharacters } from '@/slices/charactersSlice';
import Sizes from '@/constants/Sizes';

export default function ChatIndexPage() {
  const likedCharacters = useSelector(selectLikedCharacters);

  if (likedCharacters.length === 0) {
    return (
      <View style={styles.centeredContainer}>
        <Stack.Screen
          options={{
            headerShown: false,
            presentation: 'transparentModal',
            contentStyle: {
              backgroundColor: 'transparent',
            },
            headerTitle: "Mes plans cult'",
          }}
        />
        <Text>Pas de matchs, pas de chocolat…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
          presentation: 'transparentModal',
          contentStyle: {
            backgroundColor: 'transparent',
          },
          headerTitle: "Mes plans cult'",
        }}
      />
      <FlatList
        data={likedCharacters.toReversed()}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.CharacterChatItemContainer}
        renderItem={({ item }) => <CharacterChatItem character={item} />}
        // renderItem={({ item }) => <Text>{item.name}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: Sizes.pageContentHorizontalMargin,
    marginVertical: Sizes.pageContentVerticalMargin,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  CharacterChatItemContainer: {
    gap: 6,
  },
});
