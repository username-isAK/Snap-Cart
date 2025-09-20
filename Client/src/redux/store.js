import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/productSlice";
import categoryReducer from "./slices/categorySlice";
import orderReducer from "./slices/orderSlice";
import cartReducer from "./slices/cartSlice";
import userReducer from "./slices/userSlice";

const store = configureStore({
  reducer: {
    products: productReducer,
    categories: categoryReducer,
    orders: orderReducer,
    cart: cartReducer,
    user: userReducer
  },
});

export default store;
