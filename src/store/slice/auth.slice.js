import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: '',
    user: null,
  },
  reducers: {

    setToken: (state, action) => {
      state.token = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { authAdded, authToggled, setToken, setUser } = authSlice.actions;
export default authSlice.reducer;
