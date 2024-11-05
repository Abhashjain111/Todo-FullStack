import { configureStore } from '@reduxjs/toolkit';
import todoReducer from './TodoSlice';

const store = configureStore({
  reducer: {
    todo: todoReducer,
  },
});

// Types for RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
