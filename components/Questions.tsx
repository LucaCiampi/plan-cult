import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { View, Button, Text } from "react-native";
import {
  addMessageToConversation,
  setCurrentQuestions,
  setPreviousQuestions,
  resetToPreviousQuestions,
} from "@/features/chat/chatSlice";

const Questions = () => {
  const dispatch = useDispatch();
  const { currentQuestions, conversations } = useSelector(
    (state: any) => state.chat
  );

  const handleQuestionClick = async (
    question: string[],
    followUp: any[],
    answers: string[]
  ) => {
    // Ajouter la question à la conversation
    question.forEach((q) => dispatch(addMessageToConversation(q)));

    // Attendre 1 seconde avant de montrer les réponses
    setTimeout(() => {
      answers.forEach((answer) => dispatch(addMessageToConversation(answer)));
      if (followUp) {
        dispatch(setPreviousQuestions(currentQuestions));
        dispatch(setCurrentQuestions(followUp));
      } else {
        dispatch(resetToPreviousQuestions());
      }
    }, 1000); // Délai de 1 seconde
  };

  return (
    <View>
      {currentQuestions.map((q: any) => (
        <Button
          key={q.id}
          title={q.question_short}
          onPress={() => handleQuestionClick(q.question, q.followUp, q.answer)}
        />
      ))}
    </View>
  );
};

export default Questions;
