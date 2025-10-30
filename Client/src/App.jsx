import { BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import AdminDashboard from "./Components/Admin/AdminDashboard";
import Login from "./Components/Auth/Login";
import Signup from "./Components/Auth/Signup";
import ForgotPassword from "./Components/Auth/ForgotPass";
import { fetchUserProfile } from "./redux/slices/userSlice";
import Products from "./Components/Admin/Products";
import AdminLayout from "./Components/Admin/Adminlayout";
import "./App.css";
import Orders from "./Components/Admin/Orders";
import UserDashboard from "./Components/User/UserDashboard";
import UserLayout from "./Components/User/Userlayout";
import Productdetails from "./Components/User/Productdetails";
import Cartbutton from "./Components/User/Cartbutton";
import Checkoutpage from "./Components/User/Checkoutpage";

export default function App() {
  const dispatch = useDispatch();
  const { token, userInfo, loading } = useSelector((state) => state.user);
  const location = useLocation();

  useEffect(() => {
    if (token && !userInfo) {
      dispatch(fetchUserProfile());
    }
  }, [token, userInfo, dispatch]);

  const authPaths = ["/login", "/signup", "/reset-password"];
  const adminPaths = ["/admin", "/admin/productslist", "/admin/orderslist"];
  const isAuthPage = authPaths.includes(location.pathname);
  const isAdminPage = adminPaths.includes(location.pathname);

  return token && !userInfo && loading ? (
    <p className="text-center mt-10"><img src="spinner.gif"/></p>
  ) : (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: isAuthPage
            ? 'url("/Authbgimg.png")'
            : isAdminPage? 'url("/Bgimg.jpg")': "",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          zIndex: -2,
        }}/>
        
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset-password" element={<ForgotPassword />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="productslist" element={<Products />} />
          <Route path="orderslist" element={<Orders />} />
        </Route>

        <Route path="/client" element={<UserLayout />}>
          <Route index element={<UserDashboard/>}/>
          <Route path="product/:id" element={<Productdetails />} />
          <Route path="checkout" element={<Checkoutpage/>} />
        </Route>
        
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <Cartbutton/>
    </div>
  );
}

