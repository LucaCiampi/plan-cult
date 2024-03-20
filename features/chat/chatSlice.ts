// store/chatSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChatState {
  conversations: string[];
  currentQuestions: Dialogue[];
  previousQuestions: Dialogue[];
}

const initialState: ChatState = {
  conversations: [],
  currentQuestions: [],
  previousQuestions: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setConversations: (state, action: PayloadAction<string[]>) => {
      state.conversations = action.payload;
    },
    setCurrentQuestions: (state, action: PayloadAction<Dialogue[]>) => {
      state.currentQuestions = action.payload;
    },
    setPreviousQuestions: (state, action: PayloadAction<Dialogue[]>) => {
      state.previousQuestions = action.payload;
    },
    addMessageToConversation: (state, action: PayloadAction<string>) => {
      state.conversations.push(action.payload);
    },
    resetToPreviousQuestions: (state) => {
      state.currentQuestions = state.previousQuestions;
    },
  },
});

export const {
  setConversations,
  setCurrentQuestions,
  setPreviousQuestions,
  addMessageToConversation,
  resetToPreviousQuestions,
} = chatSlice.actions;
export default chatSlice.reducer;
