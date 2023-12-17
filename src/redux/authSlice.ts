import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
  // Другие поля, связанные с аутентификацией, если необходимо
}

const initialState: AuthState = {
  isAuthenticated: false,
  username: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
      setAuthenticated: (state, action) => {
        state.isAuthenticated = action.payload.isAuthenticated;
        state.username = action.payload.username;
      },
      setUsername: (state, action) => {
        state.username = action.payload;
      },
    },
  });

export const { setAuthenticated } = authSlice.actions;
export default authSlice.reducer;