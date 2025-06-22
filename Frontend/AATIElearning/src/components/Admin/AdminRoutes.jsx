import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Dashboard from  "./Dashboard";


// Mock protected route
const isAuthenticated = true; 

const AdminRoutes = () => {
  return isAuthenticated ? (
    <Routes>
     <Route path="/admin/dashboard" element={<Dashboard />} />

    </Routes>
  ) : (
    <Navigate to="/" />
  );
};

export default AdminRoutes;
