import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '@/app/store';
import { generateRandomPositionInBoundaries } from '@/utils/distanceUtils';
import { annecyBoundary, lyonBoundary } from '@/constants/Coordinates';
import { updateQuestionsToNewTrustLevel } from '@/slices/chatSlice';

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

  // Spécifie les ID et les coordonnées spécifiques
  // TODO: supprimer ceci
  const specificCoordinates = new Map<
    number,
    { latitude: number; longitude: number }
  >([
    [4, { latitude: 45.7515747, longitude: 4.8377601 }], // Paul Bocuse
    [5, { latitude: 45.7478312, longitude: 4.8336335 }], // Edouard Herriot
    [2, { latitude: 45.7553046, longitude: 4.8428548 }], // Antoine Saint Exupéry
  ]);

  const updatedCharacters = allCharacters.map((character) => {
    const specificCoord = specificCoordinates.get(character.id);
    console.log(character.city);

    if (specificCoord !== null && specificCoord !== undefined) {
      // Assigner les coordonnées spécifiques si l'ID correspond
      return {
        ...character,
        coordinates: specificCoord,
      };
    } else if (
      character.city !== undefined &&
      character.city === 'Annecy - Papeteries'
    ) {
      // Assigner les coordonnées spécifiques si l'ID correspond
      return {
        ...character,
        coordinates: generateRandomPositionInBoundaries(
          annecyBoundary.north,
          annecyBoundary.south,
          annecyBoundary.east,
          annecyBoundary.west
        ),
      };
    }
    // Sinon, assigner des coordonnées aléatoires
    return {
      ...character,
      coordinates: generateRandomPositionInBoundaries(
        lyonBoundary.north,
        lyonBoundary.south,
        lyonBoundary.east,
        lyonBoundary.west
      ),
    };
  });

  return updatedCharacters;
});

export const increaseTrustAndFetchQuestions = createAsyncThunk<
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  void,
  { characterId: number },
  {
    state: RootState;
    dispatch: AppDispatch;
    extra: { dbService: IDatabaseService };
  }
>(
  'characters/increaseTrustAndFetchQuestions',
  async ({ characterId }, { dispatch, getState, extra }) => {
    dispatch(increaseCharacterTrustLevel({ characterId }));
    const state = getState();
    const character = selectCharacterOfId(state, characterId);
    if (character != null) {
      const newTrustLevel = (character.trust_level ?? 0) + 1;
      await dispatch(
        updateQuestionsToNewTrustLevel({ characterId, newTrustLevel })
      );
    }
  }
);

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
      action: PayloadAction<{ characterId: number }>
    ) => {
      const { characterId } = action.payload;
      const character = state.likedCharacters.find((c) => c.id === characterId);
      if (character != null) {
        character.trust_level = (character.trust_level ?? 0) + 1;
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
export const selectCharacterOfId = (state: RootState, characterId: number) =>
  state.characters.allCharacters.find(
    (character) => character.id === characterId
  );

export default charactersSlice.reducer;
