import { configureStore, combineReducers, applyMiddleware } from '@reduxjs/toolkit';
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import thunk from 'redux-thunk'; // Import Redux Thunk middleware

import authReducer from './slice/auth.slice';
import recipeReducer from './slice/recipe.slice'; 

const persistConfig = {
  key: 'root',
  timeout: null,
  storage: AsyncStorage,
};

const reducers = combineReducers({
  auth: authReducer, 
  recipe: recipeReducer, 
});

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
    thunk, 
  ],
});
