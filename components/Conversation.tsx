// components/Conversation.tsx
import React from "react";
import { useSelector } from "react-redux";
import { View, Text, StyleSheet } from "react-native";
import { selectConversations } from "@/features/chat/chatSlice";
import Colors from "@/constants/Colors";

const Conversation = () => {
  const conversations = useSelector(selectConversations);

  return (
    <View>
      {conversations.map((message: Message, index: number) => (
        <View
          key={index}
          style={
            message.sender === "user"
              ? styles.userMessage
              : styles.characterMessage
          }
        >
          <Text>{message.text}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: Colors.secondary,
    color: "white",
    padding: 10,
    borderRadius: 10,
    margin: 5,
  },
  characterMessage: {
    alignSelf: "flex-start",
    backgroundColor: "white",
    color: "black",
    padding: 10,
    borderRadius: 10,
    margin: 5,
  },
});

export default Conversation;
