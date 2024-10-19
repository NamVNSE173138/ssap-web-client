import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  unreadNotify: parseInt(localStorage.getItem('unreadNotify') || '0'),
};

const unreadNotifySlice = createSlice({
  name: 'unreadNotify',
  initialState,
  reducers: {
    incrementUnread(state) {
      state.unreadNotify += 1;
      localStorage.setItem('unreadNotify', state.unreadNotify +"");
      document.title = document.title.split(" ")[1];
      document.title = "(" + state.unreadNotify + ") " + document.title;
    },
    decrementUnread(state) {
      state.unreadNotify -= 1;
      localStorage.setItem('unreadNotify', state.unreadNotify +"");
      if (state.unreadNotify == 1) {
        document.title = document.title.split(" ")[1];
      }
      else{
        document.title = document.title.split(" ")[1];
        document.title = "(" + state.unreadNotify + ") " + document.title;
      }
    },
    resetUnread(state) {
      state.unreadNotify = 0;
      localStorage.setItem('unreadNotify', 0+"");
      document.title = document.title.split(" ")[1];
    },
  }
});

// Export actions
export const { incrementUnread, decrementUnread, resetUnread } = unreadNotifySlice.actions;

// Export the reducer
export default unreadNotifySlice.reducer;

