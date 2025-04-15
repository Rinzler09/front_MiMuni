import React, {useEffect, useState} from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Auth/AuthContex";


//Interface para definir la estructura del token
interface tokenPayload{
  exp:number;
  [key:string]: any;
}

//Interface para definir al uusario autenticado
interface User{
  token: string;
}

const PrivateRoute: React.FC = () => {
  const {user, isLoading, logout} = useAuth();
  const [isTokenValid, setIsTokenValid] = useState<boolean>(true);
/*
  @param token - Token JWT en formato string
  @return true si el token tiene tres partes y no ha expirado, de lo contrario false.
*/
const validacionToken = (token: string): boolean => {
  const parts: string[] = token.split(".");
  if (parts.length !== 3) {
    console.error("Token no tiene 3 partes:", token);
    return false;
  }
  try {
    const payloadJson: string = atob(parts[1]);
    const payload: tokenPayload = JSON.parse(payloadJson);
    if (!payload.exp) {
      console.error("El token no tiene 'exp'", payload);
      return false;
    }
    const now: number = Math.floor(Date.now() / 1000);
    console.log("Token expira en:", payload.exp, "ahora es:", now);
    return payload.exp > now;
  } catch (error) {
    console.error("Error decodificando el token:", error);
    return false;
  }
};


//Se realiza la validacion del token 
useEffect(() => {
  if (!isLoading && user && (user as User).token) {
    const valid: boolean = validacionToken((user as User).token);
    if (!valid) {
      setIsTokenValid(false);
      logout();
    }
  }
}, [isLoading, user, logout]);
//Mientras se carga la sesion, se muestra un mensaje 
if (isLoading) {
  return <div>Cargando...</div>;
}

//si no existe un usuario autenticado, redirige a la pagina de login
if (!user || !(user as User).token || !isTokenValid) {
  return <Navigate to="/" replace />;
}

//Si el token es valido, renderiza el componente hijo
return <Outlet />;
};

export default PrivateRoute;