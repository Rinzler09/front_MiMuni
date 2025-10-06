import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import NotFound from "../Components/ErrorMessage/NotFound";
import LoginForm from "../pages/LoginForm";
import RegistrarUsuario from "../pages/RegistrarUsuario";
import General from "../pages/General";
import CambioContrasena from "../pages/CambioContrasena";
import RecuperarContrasena from "../pages/ReseteoContraseña/RecuperarContrasena";
import RestablecerContrasena from "../pages/ReseteoContraseña/RestablecerContrasena";

// Importamos nuestro PrivateRoute
import PrivateRoute from "./PrivateRoute";
import PublicRoutes from "./PublicRoutes";



const AppRoutes: React.FC = () => {
  return (

    <Router>
      <Routes>

        <Route element={<PublicRoutes />}>
          {/* Ruta de Login */}
          <Route path="/" element={<LoginForm />} />
          {/* Ruta de Registrar Usuario */}
          <Route path="/registrar-usuario" element={<RegistrarUsuario />} />
          {/* Ruta de enviar codigo */}
          <Route path="/enviar-codigo" element={<RecuperarContrasena />} />
        </Route>

        {/* Ruta protegida: :tipo */}
        <Route element={<PrivateRoute />}>
          <Route path=":tipo" element={<General />} />
          <Route path="cambio-contrasena" element={<CambioContrasena />} />
          <Route path="restablecer-contrasena" element={<RestablecerContrasena />} />
        </Route>

        {/* Ruta de pagina no encontrada
        <Route element={<NotFound />} /> */}

      </Routes>
    </Router>
  );
};

export default AppRoutes;