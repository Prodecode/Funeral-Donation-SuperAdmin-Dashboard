import React from 'react'; // Add this if using React < 18
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("FuneralToken");

  if (!token) {
    return <Navigate to="/" replace />; // Added 'replace' prop
  }

  return <Outlet />;
};

export default ProtectedRoute;