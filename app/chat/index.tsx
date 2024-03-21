import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { selectLikedCharacters } from '../../features/characters/charactersSlice';
import CharacterChatItem from '@/features/characters/CharacterChatItem';
import { Stack } from 'expo-router';
import { initializeCharacterChatState } from '@/features/chat/chatSlice';

export default function ChatPage() {
  const likedCharacters = useSelector(selectLikedCharacters);
  const dispatch = useDispatch();

  useEffect(() => {
    likedCharacters.forEach((character) => {
      const characterId = character.id.toString();
      const initialChatState = {
        conversation: [],
        currentQuestions: [],
        previousQuestions: [],
      };
      dispatch(initializeCharacterChatState({ characterId, initialChatState }));
    });
  }, [likedCharacters, dispatch]);

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
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
