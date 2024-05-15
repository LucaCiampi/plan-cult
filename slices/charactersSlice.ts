import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '@/app/store';
import { generateRandomPositionInBoundaries } from '@/utils/randomUtils';
import { lyonBoundary } from '@/constants/Coordinates';

interface CharactersState {
  allCharacters: Character[];
  likedCharacters: Character[];
}

const initialState: CharactersState = {
  allCharacters: [],
  likedCharacters: [],
};

// Créer l'action asynchrone pour récupérer tous les personnages
export const fetchAllCharacters = createAsyncThunk<
  Character[],
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  void,
  { state: RootState; extra: { dbService: IDatabaseService } }
>('characters/fetchAllCharacters', async (_, { extra }) => {
  console.log('🪨 fetchAllCharacters');

  const { dbService } = extra;
  const allCharacters = await dbService.getAllCharacters();
  return allCharacters;
});

export const updateCharacterCoordinates = createAsyncThunk<
  Character[],
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  void,
  { state: RootState }
>('characters/updateCharacterCoordinates', async (_, { getState }) => {
  console.log('🪨 updateCharacterCoordinates');

  const state: RootState = getState();
  const { allCharacters } = state.characters;

  const updatedCharacters = allCharacters.map((character) => ({
    ...character,
    coordinates: generateRandomPositionInBoundaries(
      lyonBoundary.north,
      lyonBoundary.south,
      lyonBoundary.east,
      lyonBoundary.west
    ),
  }));

  return updatedCharacters;
});

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
    dislikeCharacter: (state, action: PayloadAction<number>) => {
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
  extraReducers: (builder) => {
    builder.addCase(
      updateCharacterCoordinates.fulfilled,
      (state, action: PayloadAction<Character[]>) => {
        state.allCharacters = action.payload;
      }
    );
    builder.addCase(
      fetchAllCharacters.fulfilled,
      (state, action: PayloadAction<Character[]>) => {
        state.allCharacters = action.payload;
      }
    );
  },
});

export const {
  setCharacters,
  likeCharacter,
  dislikeCharacter,
  increaseCharacterTrustLevel,
} = charactersSlice.actions;

export const selectAllCharacters = (state: RootState) =>
  state.characters.allCharacters;
export const selectLikedCharacters = (state: RootState) =>
  state.characters.likedCharacters;

export default charactersSlice.reducer;
