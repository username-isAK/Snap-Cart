import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchCart = createAsyncThunk(
  "cart/fetch",
  async (token, { rejectWithValue }) => {
    try {
      const res = await axios.get("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/add",
  async ({ productId, quantity, token }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/cart",
        { productId, quantity },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/update",
  async ({ productId, quantity, token }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        "http://localhost:5000/api/cart",
        { productId, quantity },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

export const removeCartItem = createAsyncThunk(
  "cart/remove",
  async ({ productId, token }, { rejectWithValue }) => {
    try {
      const res = await axios.delete("http://localhost:5000/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { productId },
      });
      return productId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (i) => i.product._id !== action.payload
        );
      })
      .addMatcher(
        (action) => action.type.startsWith("cart/") && action.type.endsWith("rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export default cartSlice.reducer;
