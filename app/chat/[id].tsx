import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";

// Importer le fichier JSON
import dialogue from "../../assets/dialogues/test/dialogue.json";
import { Stack, useLocalSearchParams } from "expo-router";
import { useSelector } from "react-redux";
import { selectLikedCharacters } from "@/features/characters/charactersSlice";

export default function ChatWithCharacterPage() {
  const { id } = useLocalSearchParams();
  const likedCharacters = useSelector(selectLikedCharacters);
  const [character, setCharacter] = useState<Character | null>(null);
  const [trustLevel, setTrustLevel] = useState<number>(0);

  useEffect(() => {
    // Trouver le personnage par id
    const char = likedCharacters.find((c) => c.id.toString() === id);
    setCharacter(char ?? null);
  }, [id, likedCharacters]);

  if (!character) {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: "Introuvable",
          }}
        />
        <Text>Discussion introuvable</Text>
      </View>
    );
  }

  return (
    <View style={styles.chatContainer}>
      <Stack.Screen
        options={{
          title: `${character.name} ${character.surname ?? ""}`,
          headerBackTitle: "Retour",
        }}
      />
      <ScrollView style={styles.scrollView}>
        {dialogue[trustLevel].map((item, index) => (
          <InitialQuestionDisplayComponent key={index} item={item} />
        ))}
      </ScrollView>
    </View>
  );
}

const InitialQuestionDisplayComponent = ({ item }: { item: Question }) => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);

  return (
    <View>
      {currentQuestion ? (
        <DisplayComponent item={currentQuestion} />
      ) : (
        <TouchableOpacity
          style={styles.questionButton}
          onPress={() => setCurrentQuestion(item)}
        >
          <Text style={styles.questionText}>{item.question_short}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const DisplayComponent: React.FC<{ item: Question }> = ({ item }) => {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    // Ajouter la question après un court délai pour simuler la "frappe" du message
    timeoutId = setTimeout(() => {
      setMessages((prevMessages) => [...prevMessages, ...item.question]);
      // Ajouter la réponse après un délai pour simuler la réception du message
      setTimeout(() => {
        setMessages((prevMessages) => [...prevMessages, ...item.answer]);
        if (item.followUp && item.followUp.length > 0) {
          // Ici, nous ajoutons simplement le question_short du followUp comme un message
          // Dans une application réelle, vous souhaiteriez probablement permettre une interaction supplémentaire ici
          setMessages((prevMessages) => [
            ...prevMessages,
            item.followUp[0].question_short,
          ]);
        }
      }, 1000);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [item.question, item.answer, item.followUp]);

  return (
    <View>
      {messages.map((msg, index) => (
        <Text key={index} style={styles.messageText}>
          {msg}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    paddingTop: 20,
  },
  questionButton: {
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 20,
    marginVertical: 5,
  },
  questionText: {
    color: "#ffffff",
    textAlign: "center",
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
    padding: 8,
    backgroundColor: "white",
    borderRadius: 10,
    marginVertical: 4,
    alignSelf: "flex-start",
  },
});

// Assurez-vous que l'interface Question est correctement définie pour correspondre à votre structure de données
