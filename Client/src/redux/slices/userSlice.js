import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const registerUser = createAsyncThunk(
  "user/register",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/register",
        userData,
        { headers: { "Content-Type": "application/json" } }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  "user/fetchProfile",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().user.token;
      if (!token) return rejectWithValue("No token found");
      const res = await axios.get("http://localhost:5000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data; // user object
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

export const deleteUserProfile = createAsyncThunk(
  "user/deleteProfile",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().user.token;
      if (!token) return rejectWithValue("No token found");
      const res = await axios.delete("http://localhost:5000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: null,
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.userInfo = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem("userInfo");
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(registerUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // Login
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchUserProfile.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state) => {
        state.loading = false;
        state.userInfo = null;
        state.token = null;
        localStorage.removeItem("token");
      })

      .addCase(deleteUserProfile.fulfilled, (state) => {
        state.userInfo = null;
        state.token = null;
        state.loading = false;
        state.error = null;
        localStorage.removeItem("token");
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
