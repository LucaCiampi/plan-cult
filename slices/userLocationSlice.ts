// userLocationSlice.ts
import { RootState } from '@/app/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserLocationState {
  userLocation: Coordinates;
  error: string | null;
}

/**
 * Positions utilisées pour la présentation
 */
const defaultUserLocations: Coordinates[] = [
  {
    // Centre, à côté de place des terreaux
    latitude: 45.767135,
    longitude: 4.833658,
  },
  {
    // Mâchecroute
    latitude: 45.754,
    longitude: 4.8379504,
  },
];

const initialState: UserLocationState = {
  userLocation: defaultUserLocations[0],
  error: null,
};

const userLocationSlice = createSlice({
  name: 'userLocation',
  initialState,
  reducers: {
    setUserLocation: (state, action: PayloadAction<Coordinates>) => {
      state.userLocation = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const { setUserLocation, setError } = userLocationSlice.actions;
export const selectUserLocation = (state: RootState) =>
  state.userLocation.userLocation;

export default userLocationSlice.reducer;
