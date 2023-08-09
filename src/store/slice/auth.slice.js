import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState: [],
  reducers: {
    authAdded(state, action) {
      state.push({
        id: action.payload.id,
        text: action.payload.text,
        completed: false
      })
    },
    authToggled(state, action) {
      const auth = state.find(auth => auth.id === action.payload)
      auth.completed = !auth.completed
    }
  }
})

export const { authAdded, authToggled } = authSlice.actions
export default authSlice.reducer