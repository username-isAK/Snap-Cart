import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const getToken = () => localStorage.getItem("token");

export const fetchCart = createAsyncThunk(
  "cart/fetch",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) return rejectWithValue("User not logged in");
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
  "cart/addToCart",
  async ({ productId, quantity, selectedSize, selectedColor }, { getState, rejectWithValue }) => {
    const token = getState().user.token;
    try {
      const res = await axios.post(
        "http://localhost:5000/api/cart/",
        { productId, quantity, selectedSize, selectedColor },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const items = res.data.items.map((it) => ({
        ...it,
        product: typeof it.product === "string" ? { _id: it.product, images: [], name: "Unknown Product", price: 0 } : it.product
      }));

      return { items };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/update",
  async ({ productId, quantity }, { getState, rejectWithValue }) => {
    const token = getToken();
    if (!token) return rejectWithValue("User not logged in");
    try {
      const res = await axios.put(
        "http://localhost:5000/api/cart",
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const items = res.data.items.map((it) => ({
        ...it,
        product: typeof it.product === "string" ? { _id: it.product, images: [], name: "Unknown Product", price: 0 } : it.product
      }));

      return { items };
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

export const removeCartItem = createAsyncThunk(
  "cart/remove",
  async ({ productId }, { rejectWithValue }) => {
    const token = getToken();
    if (!token) return rejectWithValue("User not logged in");
    try {
      await axios.delete("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
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
      .addCase(fetchCart.pending, (state) => { state.loading = true; })
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
        state.items = state.items.filter((i) => i.product._id !== action.payload);
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
