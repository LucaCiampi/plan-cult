// features/characters/charactersSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '@/app/store';
import { setCurrentQuestions } from '@/features/chat/chatSlice';

interface CharactersState {
  allCharacters: Character[];
  likedCharacters: Character[];
}

const initialState: CharactersState = {
  allCharacters: [],
  likedCharacters: [],
};

export const charactersSlice = createSlice({
  name: 'characters',
  initialState,
  reducers: {
    setCharacters: (state, action: PayloadAction<Character[]>) => {
      state.allCharacters = action.payload;
    },
    likeCharacter: (state, action: PayloadAction<number>) => {
      const character = state.allCharacters.find(
        (c) => c.id === action.payload
      );
      if (character != null) {
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
    increaseCharacterTrustLevel: (
      state,
      action: PayloadAction<{ characterId: number; newTrustLevel: number }>
    ) => {
      const { characterId, newTrustLevel } = action.payload;
      const character = state.likedCharacters.find((c) => c.id === characterId);
      if (character != null) {
        character.trust_level = newTrustLevel;
      }
    },
  },
});

export const {
  setCharacters,
  likeCharacter,
  removeCharacter,
  increaseCharacterTrustLevel,
} = charactersSlice.actions;

// Ajoutez une action thunk pour gérer l'augmentation du niveau de confiance
export const increaseTrustLevel = createAsyncThunk(
  'characters/increaseTrustLevel',
  async (
    {
      characterId,
      dbService,
    }: { characterId: number; dbService: IDatabaseService },
    { getState, dispatch }
  ) => {
    const state: RootState = getState() as RootState;
    const { likedCharacters } = state.characters;
    const character = likedCharacters.find((c) => c.id === characterId);

    if (character != null) {
      // TODO: rendre trust_level obligatoire dans le type Character
      let trustLevel: number = character.trust_level ?? 0;
      ++trustLevel;
      console.log(
        '🍕 increaseTrustLevel of character',
        character.name,
        'now',
        trustLevel
      );

      dispatch(
        increaseCharacterTrustLevel({ characterId, newTrustLevel: trustLevel })
      );

      const newQuestions = await dbService.getFirstDialoguesOfTrustLevel(
        characterId,
        trustLevel
      );

      dispatch(
        setCurrentQuestions({
          characterId: String(characterId),
          questions: newQuestions,
        })
      );
    } else {
      console.log(
        '🍕 increaseTrustLevel: character not found or not in likedCharacters. ID:',
        characterId
      );
    }
  }
);

export const selectAllCharacters = (state: RootState) =>
  state.characters.allCharacters;
export const selectLikedCharacters = (state: RootState) =>
  state.characters.likedCharacters;

export default charactersSlice.reducer;
