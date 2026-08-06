import { createSlice } from "@reduxjs/toolkit";

const userInfoFromStorage =
  localStorage.getItem("userInfo")
    ? JSON.parse(
        localStorage.getItem("userInfo")
      )
    : null;

const initialState = {
  // userInfo: null,
  userInfo: userInfoFromStorage,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    setUser: (state, action) => {
      state.userInfo = action.payload;
    },

    logout: (state) => {
      state.userInfo = null;
    },
  },
});

export const { setUser, logout } = authSlice.actions;

export default authSlice.reducer;