import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: localStorage.getItem('fcmToken') || null,
};

const fcmTokenSlice = createSlice({
  name: 'fcmToken',
  initialState,
  reducers: {
    setFcmToken(state, action) {
      localStorage.setItem('fcmToken', action.payload);
      state.token = action.payload;
    },
    removeFcmToken(state) {
      localStorage.removeItem('fcmToken');
      state.token = null;
    },
  }
});

// Export actions
export const { setFcmToken, removeFcmToken } = fcmTokenSlice.actions;

// Export the reducer
export default fcmTokenSlice.reducer;

