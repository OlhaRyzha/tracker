import { QueryParams } from '@/types/shared/track';
import { createSlice } from '@reduxjs/toolkit';

export interface CacheState {
  [key: string]: QueryParams;
}

export const initialState: CacheState = {};

export const cacheSlice = createSlice({
  name: 'cache',
  initialState,
  reducers: {
    setCacheParams: (state, action) => {
      state[action.payload.key] = action.payload.params;
    },
  },
});

export const { setCacheParams } = cacheSlice.actions;
export default cacheSlice.reducer;
