import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Usernavbar from "./UserNavbar";

const UserLayout = () => {
  const { token, userInfo } = useSelector((state) => state.user);

  if (!token) return <Navigate to="/login" replace />;
  if (!userInfo) return <p>Loading...</p>;
  if (userInfo.role !== "user") return <Navigate to="/login" replace />;

  return (
    <>
      <Usernavbar />
      <div className="container mt-4">
        <Outlet /> 
      </div>
    </>
  );
};

export default UserLayout;
