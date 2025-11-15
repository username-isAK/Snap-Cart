import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Usernavbar from "./Usernavbar";
import Footer from "./Footer";

const UserLayout = () => {
  const { token, userInfo } = useSelector((state) => state.user);

  if (!token) return <Navigate to="/login" replace />;
  if (!userInfo) return <p>Loading...</p>;
  if (userInfo.role !== "user") return <Navigate to="/login" replace />;

  return (
    <div className="d-flex flex-column min-vh-100">
      <Usernavbar />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;
