// features/chat/chatSlice.ts
import { RootState } from '@/app/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CharacterChatState {
  conversation: Message[];
  currentQuestions: Dialogue[];
  previousQuestions: Dialogue[];
}

interface ChatState {
  chatsByCharacter: Record<string, CharacterChatState>;
}

const initialState: ChatState = {
  chatsByCharacter: {},
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    initializeCharacterChatState: (
      state,
      action: PayloadAction<{
        characterId: string;
        initialChatState: CharacterChatState;
      }>
    ) => {
      console.log('🍰 initializeCharacterChatState');

      const { characterId, initialChatState } = action.payload;
      state.chatsByCharacter[characterId] = initialChatState;
    },
    addMessageToConversation: (
      state,
      action: PayloadAction<{ characterId: string; message: Message }>
    ) => {
      console.log('🍰 addMessageToConversation');

      const { characterId, message } = action.payload;
      state.chatsByCharacter[characterId].conversation.push(message);
    },
    clearMessagesFromConversation: (
      state,
      action: PayloadAction<{ characterId: string }>
    ) => {
      console.log('🍰 clearMessagesFromConversation');

      const { characterId } = action.payload;
      // Réinitialisez la conversation pour le characterId spécifié à un tableau vide
      if (state.chatsByCharacter[characterId].conversation.length > 0) {
        state.chatsByCharacter[characterId].conversation = [];
      }
    },
    setCurrentQuestions: (
      state,
      action: PayloadAction<{ characterId: string; questions: Dialogue[] }>
    ) => {
      console.log('🍰 setCurrentQuestions');

      const { characterId, questions } = action.payload;
      state.chatsByCharacter[characterId].currentQuestions = questions;
    },
    setPreviousQuestions: (
      state,
      action: PayloadAction<{ characterId: string; questions: Dialogue[] }>
    ) => {
      console.log('🍰 setPreviousQuestions');

      const { characterId, questions } = action.payload;
      state.chatsByCharacter[characterId].previousQuestions = questions;
    },
    resetToPreviousQuestions: (
      state,
      action: PayloadAction<{ characterId: string }>
    ) => {
      console.log('🍰 resetToPreviousQuestions');

      const { characterId } = action.payload;
      state.chatsByCharacter[characterId].currentQuestions =
        state.chatsByCharacter[characterId].previousQuestions;
    },
  },
});

export const {
  initializeCharacterChatState,
  addMessageToConversation,
  clearMessagesFromConversation,
  setCurrentQuestions,
  setPreviousQuestions,
  resetToPreviousQuestions,
} = chatSlice.actions;

export const selectCurrentQuestions = (state: RootState, characterId: string) =>
  state.chat.chatsByCharacter[characterId].currentQuestions;

export const selectConversations = (
  state: RootState,
  characterId: string
): Message[] => {
  const chatState = state.chat.chatsByCharacter[characterId];
  return chatState.conversation;
};

export default chatSlice.reducer;
