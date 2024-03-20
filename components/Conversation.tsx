// components/Conversation.tsx
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { selectConversations } from "@/features/chat/chatSlice";
import Colors from "@/constants/Colors";

const Conversation = () => {
  const conversations = useSelector(selectConversations);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100); // Délai de 100 millisecondes pour s'assurer que le message a bien le temps de s'afficher
  }, [conversations]);

  return (
    <ScrollView ref={scrollViewRef}>
      {conversations.map((message: Message, index: number) => (
        <View
          key={index}
          style={[
            styles.message,
            message.sender === "user"
              ? styles.userMessage
              : styles.characterMessage,
          ]}
        >
          <Text>{message.text}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  message: {
    padding: 10,
    borderRadius: 10,
    margin: 5,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: Colors.secondary,
    color: "white",
  },
  characterMessage: {
    alignSelf: "flex-start",
    backgroundColor: "white",
    color: "black",
  },
});

export default Conversation;
