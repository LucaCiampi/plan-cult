// store.ts
import { configureStore } from '@reduxjs/toolkit';
import charactersReducer from '@/slices/charactersSlice';
import chatReducer from '@/slices/chatSlice';

export const store = configureStore({
  reducer: {
    characters: charactersReducer,
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // serializableCheck: false, // Vous pouvez conserver cette option si vous passez des objets non sérialisables dans vos actions
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
