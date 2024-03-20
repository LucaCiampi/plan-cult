import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { View, Button } from "react-native";
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
    question.forEach((q) => dispatch(addMessageToConversation(q)));

    // Attendre 1 seconde avant de montrer les réponses
    setTimeout(() => {
      answers.forEach((answer) => dispatch(addMessageToConversation(answer)));
      if (followUp) {
        dispatch(setPreviousQuestions(currentQuestions));
        dispatch(setCurrentQuestions(followUp as Dialogue[]));
      } else {
        dispatch(resetToPreviousQuestions());
      }
    }, 1000); // Délai de 1 seconde
  };

  return (
    <View>
      {currentQuestions &&
        currentQuestions.map((q: Dialogue) => (
          <Button
            key={q.id}
            title={q.question_short}
            onPress={() =>
              handleQuestionClick(q.question, q.followUp, q.answer)
            }
          />
        ))}
    </View>
  );
};

export default Questions;
