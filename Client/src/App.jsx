import { BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import AdminDashboard from "./Components/Admin/AdminDashboard";
import Login from "./Components/Auth/Login";
import Signup from "./Components/Auth/Signup";
import { fetchUserProfile } from "./redux/slices/userSlice";
import Products from "./Components/Admin/Products";
import AdminLayout from "./Components/Admin/Adminlayout";
import "./App.css";
import Orders from "./Components/Admin/Orders";

export default function App() {
  const dispatch = useDispatch();
  const { token, userInfo, loading } = useSelector((state) => state.user);
  const location = useLocation();

  useEffect(() => {
    if (token && !userInfo) {
      dispatch(fetchUserProfile());
    }
  }, [token, userInfo, dispatch]);

  const authPaths = ["/login", "/signup"];
  const isAuthPage = authPaths.includes(location.pathname);

  return loading ? (
    <p className="text-center mt-10">Loading...</p>
  ) : (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: isAuthPage ? 'url("/Authbgimg.png")' : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed"
      }}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="productslist" element={<Products />} />
          <Route path="orderslist" element={<Orders />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}
