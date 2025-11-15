import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async ({ search = "", page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const res = await axios.get("http://localhost:5000/api/products", {
        params: { search, page, limit },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/products/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const addProduct = createAsyncThunk(
  "products/add",
  async ({ productData, token }, { rejectWithValue }) => {
    try {
      const res = await axios.post("http://localhost:5000/api/products", productData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);


export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ id, productData, token }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/products/${id}`, productData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/delete",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    list: [],
    total: 0,
    currentPage: 1,
    totalPages: 1,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        const {
          products = [],
          total = state.total,
          currentPage = 1,
          totalPages = state.totalPages,
        } = action.payload || {};

        state.total = total;
        state.currentPage = currentPage;
        state.totalPages = totalPages;

        if (currentPage === 1) {
          state.list = products;
        } else {
          const newOnes = products.filter(
            (p) => !state.list.some((existing) => existing._id === p._id)
          );
          state.list = [...state.list, ...newOnes];
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load products";
      })
      .addCase(fetchProductById.pending, (state) => { state.loading = true; })
      .addCase(fetchProductById.fulfilled, (state, action) => { state.loading = false; state.selectedProduct = action.payload; })
      .addCase(fetchProductById.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(addProduct.fulfilled, (state, action) => { state.list.unshift(action.payload); })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const idx = state.list.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.list = state.list.filter((p) => p._id !== action.payload);
      });
  },
});


export default productSlice.reducer;
