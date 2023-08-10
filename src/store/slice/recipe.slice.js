import { createSlice } from '@reduxjs/toolkit';

const recipeSlice = createSlice({
  name: 'recipe',
  initialState: {
    recipeList: [],
    isLoading: false,
  },
  reducers: {
    setRecipeList: (state, action) => {
      state.recipeList = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setRecipeList, setLoading } = recipeSlice.actions;
export default recipeSlice.reducer;
