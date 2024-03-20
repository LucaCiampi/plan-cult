// features/characters/charactersSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

interface CharactersState {
  allCharacters: Character[];
  likedCharacters: Character[];
}

const initialState: CharactersState = {
  allCharacters: [],
  likedCharacters: [],
};

export const charactersSlice = createSlice({
  name: "characters",
  initialState,
  reducers: {
    setCharacters: (state, action: PayloadAction<Character[]>) => {
      state.allCharacters = action.payload;
    },
    likeCharacter: (state, action: PayloadAction<number>) => {
      const character = state.allCharacters.find(
        (c) => c.id === action.payload
      );
      if (character) {
        state.allCharacters = state.allCharacters.filter(
          (c) => c.id !== action.payload
        );
        state.likedCharacters.push(character);
      }
    },
    removeCharacter: (state, action: PayloadAction<number>) => {
      state.allCharacters = state.allCharacters.filter(
        (character) => character.id !== action.payload
      );
    },
  },
});

export const { setCharacters, likeCharacter, removeCharacter } =
  charactersSlice.actions;

export const selectAllCharacters = (state: RootState) =>
  state.characters.allCharacters;
export const selectLikedCharacters = (state: RootState) =>
  state.characters.likedCharacters;

export default charactersSlice.reducer;
