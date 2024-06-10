// userLocationSlice.ts
import { RootState } from '@/app/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserLocationState {
  userLocation: Coordinates;
  error: string | null;
}

const initialState: UserLocationState = {
  userLocation: {
    // Pont Gallien
    latitude: 45.7507126,
    longitude: 4.8354594,
  },
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
