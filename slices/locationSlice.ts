import { RootState } from '@/app/store';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as Location from 'expo-location';

interface LocationState {
  coords: {
    latitude: number;
    longitude: number;
    altitude?: number | null;
    accuracy?: number | null;
    altitudeAccuracy?: number | null;
    heading?: number | null;
    speed?: number | null;
  } | null;
  errorMsg: string | null;
}

const initialState: LocationState = {
  coords: null,
  errorMsg: null,
};

export const fetchLocation = createAsyncThunk(
  'location/fetchLocation',
  async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Permission to access location was denied');
    }

    const location = await Location.getCurrentPositionAsync({});
    return location.coords;
  }
);

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocation.fulfilled, (state, action) => {
        state.coords = action.payload;
        state.errorMsg = null;
      })
      .addCase(fetchLocation.rejected, (state, action) => {
        state.coords = null;
        state.errorMsg = action.error.message ?? 'Failed to fetch location';
      });
  },
});

export default locationSlice.reducer;
export const selectLocation = (state: RootState) => state.location.coords;
export const selectLocationError = (state: RootState) =>
  state.location.errorMsg;
