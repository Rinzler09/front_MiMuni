import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Auth/AuthContex";

const PrivateRoute: React.FC = () => {
  const {user} = useAuth();

  //En este caso si el usuario token no le permitira mandarlo a otras rutas
  if (!user || !user.token) {
    return <Navigate to="/"  replace/>
  }

  return <Outlet/>
}


export default PrivateRoute;