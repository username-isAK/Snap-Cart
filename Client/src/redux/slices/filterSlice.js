import { createSlice } from "@reduxjs/toolkit";

const filterSlice = createSlice({
  name: "filters",
  initialState: {
    search: "", 
    category: "",
  },
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setCategory: (state, action) => {
      state.category = action.payload;
    },
  },
});

export const { setSearch, setCategory } = filterSlice.actions;
export default filterSlice.reducer;
