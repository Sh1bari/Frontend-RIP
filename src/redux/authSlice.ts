import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
  applicationId: number | null;
  // Другие поля, связанные с аутентификацией, если необходимо
}

const initialState: AuthState = {
  isAuthenticated: false,
  username: null,
  applicationId: null,
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
      setApplicationId: (state, action) =>{
        state.applicationId = action.payload;
      },
    },
  });

export const { setAuthenticated, setUsername, setApplicationId } = authSlice.actions;
export default authSlice.reducer;