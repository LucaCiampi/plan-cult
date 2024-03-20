// components/Conversation.tsx
import React from "react";
import { useSelector } from "react-redux";
import { View, Text } from "react-native";
import { selectConversations } from "@/features/chat/chatSlice";

const Conversation = () => {
  const conversations = useSelector(selectConversations);

  return (
    <View>
      {conversations.map((message: string, index: number) => (
        <Text key={index}>{message}</Text>
      ))}
    </View>
  );
};

export default Conversation;
