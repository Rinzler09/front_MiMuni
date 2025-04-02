import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Auth/AuthContex";

const PublicRoute: React.FC = () => {
    const {user} = useAuth();
    
    return user ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default PublicRoute;
