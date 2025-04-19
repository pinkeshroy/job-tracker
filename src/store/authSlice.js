import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const initialState = {
  token: localStorage.getItem("token"),
  user: null,
  role: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token } = action.payload;
      localStorage.setItem("token", token);
      const decoded = jwtDecode(token);
      state.token = token;
      state.user = {
        id: decoded.id,
        name: decoded.name,
      };
      state.role = decoded.role;
    },
    logout: (state) => {
      localStorage.removeItem("token");
      state.token = null;
      state.user = null;
      state.role = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
