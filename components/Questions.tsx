import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { View, StyleSheet } from "react-native";
import Button from "./common/Button";
import {
  addMessageToConversation,
  setCurrentQuestions,
  setPreviousQuestions,
  resetToPreviousQuestions,
  selectCurrentQuestions,
} from "@/features/chat/chatSlice";

const Questions = () => {
  const dispatch = useDispatch();
  const { currentQuestions } = useSelector(selectCurrentQuestions);

  const handleQuestionClick = async (
    question: string[],
    followUp: Dialogue[] | unknown,
    answers: string[]
  ) => {
    // Ajouter la question à la conversation
    question.forEach((q) =>
      dispatch(addMessageToConversation({ text: q, sender: "user" }))
    );

    // Attendre 1 seconde avant de montrer les réponses
    setTimeout(() => {
      answers.forEach((answer) =>
        dispatch(
          addMessageToConversation({ text: answer, sender: "character" })
        )
      );
      if (followUp) {
        dispatch(setPreviousQuestions(currentQuestions));
        dispatch(setCurrentQuestions(followUp as Dialogue[]));
      } else {
        dispatch(resetToPreviousQuestions());
      }
    }, 1000); // Délai de 1 seconde
  };

  return (
    <View style={styles.questionsOptions}>
      {currentQuestions &&
        currentQuestions.map((q: Dialogue) => (
          <Button
            key={q.id}
            onPress={() =>
              handleQuestionClick(q.question, q.followUp, q.answer)
            }
          >
            {q.question_short}
          </Button>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  questionsOptions: {
    gap: 6,
    padding: 6,
  },
});

export default Questions;
