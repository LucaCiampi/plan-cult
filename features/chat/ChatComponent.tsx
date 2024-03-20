import React, { useEffect } from "react";
import { View, ScrollView, StyleSheet, Text } from "react-native";
import { useDispatch } from "react-redux";
import { setCurrentQuestions } from "./chatSlice";
import Conversation from "@/components/Conversation";
import Questions from "@/components/Questions";

// TODO: rendre dynamique
import dialoguesData from "@/assets/dialogues/test/dialogue.json";

const ChatComponent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialiser avec le premier niveau de questions du JSON
    dispatch(setCurrentQuestions(dialoguesData[0]));
  }, [dispatch]);

  return (
    <>
      <View style={styles.chatView}>
        <Conversation />
        <Questions />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  chatView: {
    height: "100%",
  },
});

export default ChatComponent;
