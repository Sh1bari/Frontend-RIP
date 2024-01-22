import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
  applicationId: number | null;
  role: string | "";
  eventName: string | "";
  eventStatus: string | "ACTIVE";
  // Другие поля, связанные с аутентификацией, если необходимо
}

const initialState: AuthState = {
  isAuthenticated: false,
  username: null,
  applicationId: null,
  role: "",
  eventName: "",
  eventStatus: "ACTIVE",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.username = action.payload.username;
    },
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    setApplicationId: (state, action) => {
      state.applicationId = action.payload;
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
    setEventName: (state, action) => {
      state.eventName = action.payload;
    },
    setEventStatus: (state, action) => {
      state.eventStatus = action.payload;
    },
  },
});

export const {
  setAuthenticated,
  setUsername,
  setApplicationId,
  setRole,
  setEventName,
  setEventStatus,
} = authSlice.actions;
export default authSlice.reducer;
