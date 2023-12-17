import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  data: any[]; // замените any на актуальный тип данных
}

const initialState: AppState = {
  data: [],
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<any[]>) => {
      state.data = action.payload;
    },
  },
});

export const { setData } = appSlice.actions;
export default appSlice.reducer;