// src/routes/PrivateRoute.tsx
import { Navigate, Outlet } from "react-router-dom";// Libreria  de react router dom para el manejo de rutas
import { useAuth } from "../Auth/AuthContext";// Importamos el context de autenticacion

const PrivateRoute: React.FC = () => {
     const { token } = useAuth();// Se obtiene el usuario del context de autenticacion

    console.log("Validacion de token en PrivateRoute, token: ", token);
    return token ? <Outlet /> : <Navigate to="/" />;
    //se debe validar despues de 2s

    // return user ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;