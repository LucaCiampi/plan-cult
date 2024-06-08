import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '@/app/store';
import { generateRandomPositionInBoundaries } from '@/utils/distanceUtils';
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
  // Type de la valeur de retour
  Character[],
  // Type de l'argument d'entrée
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  void,
  // Type des options de configuration supplémentaires
  { state: RootState; extra: { dbService: IDatabaseService } }
>('characters/fetchAllCharacters', async (_, { extra }) => {
  console.log('🪨 fetchAllCharacters');

  const { dbService } = extra;
  const allCharacters = await dbService.getAllCharacters();
  return allCharacters;
});

export const updateCharacterCoordinates = createAsyncThunk<
  // Type de la valeur de retour
  Character[],
  // Type de l'argument d'entrée
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  void,
  // Type des options de configuration supplémentaires
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
      console.log('🏷️ setCharacters');
      state.allCharacters = action.payload;
    },
    likeCharacter: (state, action: PayloadAction<number>) => {
      console.log('🏷️ likeCharacter');
      const character = state.allCharacters.find(
        (c) => c.id === action.payload
      );
      if (character != null) {
        state.likedCharacters.push(character);
      }
    },
    dislikeCharacter: (state, action: PayloadAction<number>) => {
      console.log('🏷️ dislikeCharacter');
      state.allCharacters = state.allCharacters.filter(
        (character) => character.id !== action.payload
      );
    },
    increaseCharacterTrustLevel: (
      state,
      action: PayloadAction<{ characterId: number; newTrustLevel: number }>
    ) => {
      console.log('🏷️ increaseCharacterTrustLevel');
      const { characterId, newTrustLevel } = action.payload;
      const character = state.likedCharacters.find((c) => c.id === characterId);
      if (character != null) {
        character.trust_level = newTrustLevel;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        updateCharacterCoordinates.fulfilled,
        (state, action: PayloadAction<Character[]>) => {
          state.allCharacters = action.payload;
        }
      )
      .addCase(
        fetchAllCharacters.fulfilled,
        (state, action: PayloadAction<Character[]>) => {
          state.allCharacters = action.payload;
        }
      )
      .addCase(fetchAllCharacters.rejected, (state, action) => {
        console.error('Failed to fetch characters:', action.error);
      })
      .addCase(updateCharacterCoordinates.rejected, (state, action) => {
        console.error('Failed to update character coordinates:', action.error);
      });
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
