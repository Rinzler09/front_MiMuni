import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../Auth/AuthContex";

const PublicRoute: React.FC = () => {
  const location = useLocation();
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Cargando...</div>;

  // Usamos optional chaining para leer skipRedirect
  //const skipRedirect = location.state?.skipRedirect || false;
  //console.log("PublicRoute -> user:", user, "skipRedirect:", skipRedirect);

  // Si hay usuario autenticado Y no se indicó explicitamente skipRedirect, redirige a /dashboard  
  return user  ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default PublicRoute;
