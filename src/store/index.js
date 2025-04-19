import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice.js';
import jobReducer from './jobSlice.js';
import applicationReducer from './applicationSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobReducer,
    applications: applicationReducer,
  },
});
