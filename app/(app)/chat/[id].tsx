import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { selectLikedCharacters } from '@/slices/charactersSlice';
import ChatComponent from '@/components/chat/ChatComponent';
import { clearMessagesFromConversation } from '@/slices/chatSlice';

export default function ChatWithCharacterPage() {
  const { id } = useLocalSearchParams();
  const likedCharacters = useSelector(selectLikedCharacters);
  const [character, setCharacter] = useState<Character | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    // Trouve le personnage par id
    const currentCharacter = likedCharacters.find(
      (c: Character) => c.id.toString() === id
    );
    setCharacter(currentCharacter ?? null);

    return () => {
      // Dispatchez l'action pour réinitialiser la conversation à vide
      if (Platform.OS !== 'web') {
        dispatch(clearMessagesFromConversation({ characterId: id[0] }));
      }
    };
  }, [id, likedCharacters]);

  if (character == null) {
    return (
      <View>
        <Stack.Screen
          options={{
            title: 'Introuvable',
          }}
        />
        <Text>Discussion introuvable</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: `${character.name} ${character.surname ?? ''} ${
            character.trust_level
          }`,
          headerBackTitle: 'Retour',
        }}
      />
      <ChatComponent character={character} characterId={id[0]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
  },
});
