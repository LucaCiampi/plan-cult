import { useSelector } from 'react-redux';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import CharacterChatItem from '@/features/characters/CharacterChatItem';
import { selectLikedCharacters } from '@/features/characters/charactersSlice';

export default function Page() {
  const likedCharacters = useSelector(selectLikedCharacters);

  if (likedCharacters.length === 0) {
    return (
      <View style={styles.centeredContainer}>
        <Stack.Screen
          options={{
            headerShown: false,
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
        }}
      />
      <FlatList
        data={likedCharacters}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.characterContainer}>
            <CharacterChatItem character={item} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  characterContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
