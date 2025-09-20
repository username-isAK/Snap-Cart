import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import AdminDashboard from "./Components/Admin/AdminDashboard";
import Login from "./Components/Auth/Login";
import Signup from "./Components/Auth/Signup";
import { fetchUserProfile } from "./redux/slices/userSlice";

export default function App() {
  const dispatch = useDispatch();
  const { token, userInfo, loading } = useSelector((state) => state.user);

  useEffect(() => {
    if (token && !userInfo) {
      dispatch(fetchUserProfile());
    }
  }, [token, userInfo, dispatch]);

  return (
    <Router>
      {loading ? (
        <p className="text-center mt-10">Loading...</p>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin"
            element={
              !token ? (
                <Navigate to="/login" replace />
              ) : !userInfo ? (
                <p>Loading...</p>
              ) : userInfo.role === "admin" ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/login" replace />
              )
            }/>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </Router>
  );
}
