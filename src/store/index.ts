import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from 'redux';

// Import reducers
import authReducer from './slices/authSlice';
import pantryReducer from './slices/pantrySlice';
import recipeReducer from './slices/recipeSlice';
import userReducer from './slices/userSlice';

// Import middleware
import apiMiddleware from './middleware/apiMiddleware';
import syncMiddleware from './middleware/syncMiddleware';

// Configure root reducer with persistence
const rootReducer = combineReducers({
  auth: persistReducer(
    { key: 'auth', storage: AsyncStorage, blacklist: ['isLoading', 'error'] },
    authReducer
  ),
  pantry: persistReducer(
    { key: 'pantry', storage: AsyncStorage, blacklist: ['isLoading'] },
    pantryReducer
  ),
  recipes: persistReducer(
    { 
      key: 'recipes', 
      storage: AsyncStorage,
      blacklist: ['isLoading', 'suggestedRecipes'],
    },
    recipeReducer
  ),
  user: persistReducer(
    { key: 'user', storage: AsyncStorage },
    userReducer
  ),
});

// Configure store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiMiddleware, syncMiddleware),
});

// Create persistor
export const persistor = persistStore(store);

// Enable listener behavior for the store
setupListeners(store.dispatch);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
