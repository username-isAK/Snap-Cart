import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Adminnavbar from "./Adminnavbar";

const AdminLayout = () => {
  const { token, userInfo } = useSelector((state) => state.user);

  if (!token) return <Navigate to="/login" replace />;
  if (!userInfo) return <p>Loading...</p>;
  if (userInfo.role !== "admin") return <Navigate to="/login" replace />;

  return (
    <>
      <Adminnavbar />
      <div className="container mt-4">
        <Outlet /> 
      </div>
    </>
  );
};

export default AdminLayout;
