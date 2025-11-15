import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAddresses = createAsyncThunk(
  "addresses/fetchAll",
  async (_, { getState }) => {
    const token = getState().user.token;
    const res = await axios.get("http://localhost:5000/api/users/addresses", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }
);

export const addAddress = createAsyncThunk(
  "addresses/add",
  async (data, { getState }) => {
    const token = getState().user.token;
    const res = await axios.post("http://localhost:5000/api/users/addresses", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }
);

export const updateAddress = createAsyncThunk(
  "addresses/updateAddress",
  async ({ id, updatedData }, { getState }) => {
    const token = getState().user.token;
    const res = await fetch(`http://localhost:5000/api/users/addresses/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json", 
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    });
    return res.json();
  }
);


export const deleteAddress = createAsyncThunk(
  "addresses/delete",
  async (id, { getState }) => {
    const token = getState().user.token;
    const res = await axios.delete(`http://localhost:5000/api/users/addresses/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }
);

export const setDefaultAddress = createAsyncThunk(
  "addresses/setDefault",
  async (id, { getState }) => {
    const token = getState().user.token;
    const res = await axios.patch(`http://localhost:5000/api/users/addresses/${id}/default`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.addresses;
  }
);

const addressSlice = createSlice({
  name: "addresses",
  initialState: {
    list: [],
    status: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.list = action.payload;
        state.status = "succeeded";
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.list = action.payload.addresses;
      });
  },
});

export default addressSlice.reducer;
