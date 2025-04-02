import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Auth/AuthContex";

const PrivateRoute: React.FC = () => {
  const { user, isLoading, logout } = useAuth();
  const [isTokenValid, setIsTokenValid] = useState(true);

  // Función para validar el token sin usar librerías externas
  const isTokenValidFunction = (token: string): boolean => {
    // Verificar que el token tenga tres partes
    const parts = token.split('.');
    if (parts.length !== 3) {
      return false;
    }
    try {
      // Decodificar el payload (la segunda parte)
      const payloadJson = atob(parts[1]);
      const payload = JSON.parse(payloadJson);
      
      // Verificar que exista 
      if (!payload.exp) return false;
      const now = Math.floor(Date.now() / 1000);
      return payload.exp > now;
    } catch (error) {
      return false;
    }
  };

  // Validación inmediata al montar la ruta protegida
  useEffect(() => {
    if (!isLoading && user && user.token) {
      const valid = isTokenValidFunction(user.token);
      if (!valid) {
        setIsTokenValid(false);
        logout();
      }
    }
  }, [isLoading, user, logout]);

  // Mientras se carga la sesión se muestra un mensaje de carga
  if (isLoading) {
    return <div>Cargando...</div>;
  }

  // Si no existe usuario, token o el token es inválido, redirige al login
  if (!user || !user.token || !isTokenValid) {
    return <Navigate to="/" replace />;
  }

  // Si el usuario está autenticado y el token es válido, se renderiza el contenido protegido
  return <Outlet />;
};

export default PrivateRoute;
