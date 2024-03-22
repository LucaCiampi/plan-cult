// store.ts
import { configureStore } from '@reduxjs/toolkit';
import charactersReducer from '../features/characters/charactersSlice';
import chatReducer from '../features/chat/chatSlice';

export const store = configureStore({
  reducer: {
    characters: charactersReducer,
    chat: chatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
