// store/chatSlice.ts
import { RootState } from '@/app/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ChatState {
  conversation: Message[];
  currentQuestions: Dialogue[];
  previousQuestions: Dialogue[];
}

const initialState: ChatState = {
  conversation: [],
  currentQuestions: [],
  previousQuestions: [],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentQuestions: (state, action: PayloadAction<Dialogue[]>) => {
      state.currentQuestions = action.payload;
    },
    setPreviousQuestions: (state, action: PayloadAction<Dialogue[]>) => {
      state.previousQuestions = action.payload;
    },
    addMessageToConversation: (state, action: PayloadAction<Message>) => {
      state.conversation.push(action.payload);
    },
    resetToPreviousQuestions: (state) => {
      state.currentQuestions = state.previousQuestions;
    },
  },
});

export const {
  setCurrentQuestions,
  setPreviousQuestions,
  addMessageToConversation,
  resetToPreviousQuestions,
} = chatSlice.actions;

export const selectConversations = (state: RootState) =>
  state.chat.conversation;
export const selectCurrentQuestions = (state: RootState) => state.chat;

export default chatSlice.reducer;
