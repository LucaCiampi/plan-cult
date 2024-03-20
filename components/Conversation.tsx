// components/Conversation.tsx
import React from "react";
import { useSelector } from "react-redux";
import { View, Text } from "react-native";

const Conversation = () => {
  const conversations = useSelector((state: any) => state.chat.conversations);

  return (
    <View>
      {conversations.map((message: string, index: number) => (
        <Text key={index}>{message}</Text>
      ))}
    </View>
  );
};

export default Conversation;
