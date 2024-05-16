import { configureStore } from '@reduxjs/toolkit';
import charactersReducer from '@/slices/charactersSlice';
import chatReducer from '@/slices/chatSlice';
import locationReducer from '@/slices/locationSlice';
import { useDatabaseService } from '@/contexts/DatabaseServiceContext';

const dbService = useDatabaseService();

export const store = configureStore({
  reducer: {
    characters: charactersReducer,
    chat: chatReducer,
    location: locationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: { dbService },
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
