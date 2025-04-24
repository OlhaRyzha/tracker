import { RootState } from '@/store/rootReducer';
import { createSlice } from '@reduxjs/toolkit';

export interface TableState {
  selectMode: boolean;
}

export const initialState: TableState = {
  selectMode: true,
};

export const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    setSelectMode: (state, action) => {
      state.selectMode = action.payload;
    },
  },
});
export const selectSelectMode = (state: RootState) => state.table.selectMode;
export const { setSelectMode } = tableSlice.actions;
export default tableSlice.reducer;
