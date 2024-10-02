import parseJwt from '@/services/parseJwt';
import { createSlice } from '@reduxjs/toolkit';

type User = {
    aud: string,
    username: string,
    fullname: string,
    email: string,
    exp: number,
    iat: number,
    id: string,
    iss: string,
    jti: string,
    nbf: number,
    role: string,
    sub: string
}

const initialState = {
  token: localStorage.getItem('token') || null,
  user: parseJwt(localStorage.getItem('token')) as User | null
};

const tokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    setToken(state, action) {
      localStorage.setItem('token', action.payload);
      state.token = action.payload;
    },
    removeToken(state) {
      localStorage.removeItem('token');
      state.token = null;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
    removeUser(state) {
      state.user = null;
    }
  }
});

// Export actions
export const { setToken, removeToken, setUser, removeUser } = tokenSlice.actions;

// Export the reducer
export default tokenSlice.reducer;

