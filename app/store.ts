import { configureStore } from '@reduxjs/toolkit';
import charactersReducer from '@/slices/charactersSlice';
import chatReducer from '@/slices/chatSlice';
import locationReducer from '@/slices/locationSlice';

export const createStore = (dbService: any) => {
  return configureStore({
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
};

export type RootState = ReturnType<ReturnType<typeof createStore>['getState']>;
export type AppDispatch = ReturnType<typeof createStore>['dispatch'];
