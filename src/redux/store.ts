import { configureStore } from '@reduxjs/toolkit';
import companyReducer from './companies/companySlice';

// Create the store instance
const store = configureStore({
  reducer: {
    company: companyReducer,
  },
});

// Export the store to be used in the Provider
export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
