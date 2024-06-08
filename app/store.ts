import { configureStore } from '@reduxjs/toolkit';
import charactersReducer from '@/slices/charactersSlice';
import chatReducer from '@/slices/chatSlice';
import userLocationReducer from '@/slices/userLocationSlice';

export const createStore = (dbService: any) => {
  return configureStore({
    reducer: {
      characters: charactersReducer,
      chat: chatReducer,
      userLocation: userLocationReducer,
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
