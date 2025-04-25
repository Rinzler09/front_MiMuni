// src/routes/PublicRoute.tsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Auth/AuthContex";

const PublicRoute: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Cargando...</div>;

  // Si ya hay un usuario, lo mandamos al dashboard
  if (user) return <Navigate to="/dashboard" replace />;

  // Si no está logeado, renderizamos la ruta hija
  return <Outlet />;
};

export default PublicRoute;
