import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { View, StyleSheet } from "react-native";
import Button from "@/components/common/Button";
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

  /**
   * Se déclenche au clic d'un choix de question de la part de l'utilisateur
   * @param question les textes de la question posée
   * @param answers les textes de réponses en lien avec la question
   * @param followUp l'éventuel cheminement vers les questions suivantes
   */
  const handleQuestionClick = async (
    question: string[],
    answers: string[],
    followUp: Dialogue[] | undefined
  ) => {
    // Ajoute la question posée à la conversation
    question.forEach((questionSentence) =>
      dispatch(
        addMessageToConversation({ text: questionSentence, sender: "user" })
      )
    );

    // Attend 1 seconde avant d'ajouter les réponses à la conversation
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
        currentQuestions.map((currentQuestion: Dialogue) => (
          <Button
            key={currentQuestion.id}
            onPress={() =>
              handleQuestionClick(
                currentQuestion.question,
                currentQuestion.answer,
                currentQuestion.followUp
              )
            }
          >
            {currentQuestion.question_short}
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
