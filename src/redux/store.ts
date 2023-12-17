import { configureStore } from '@reduxjs/toolkit';
import appReducer from './slice';
import authReducer from './authSlice';

const store = configureStore({
  reducer: {
    app: appReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;