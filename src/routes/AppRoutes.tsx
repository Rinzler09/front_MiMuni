// src/routes/AppRoutes.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginForm from "../pages/LoginForm";
import RegistrarUsuario from "../pages/RegistrarUsuario";
import General from "../pages/General";
import CambioContraseña from "../pages/CambioContraseña";

// Importamos nuestro PrivateRoute
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Ruta de Login */}
        <Route path="/" element={<LoginForm />} />
         {/* Ruta de Registrar Usuario */}
        <Route path="/registrar-usuario" element={<RegistrarUsuario />} />
        {/* Ruta de Cambio de Contraseña */}
        <Route path="/cambio-contraseña" element={<CambioContraseña />} />

         {/* Ruta Publicas */}
         {/* <Route element={<PublicRoute />}>
        <Route path="/cambio-contraseña" element={<CambioContraseña />} />
        </Route> */}

        {/* Ruta protegida: :tipo */}
        <Route element={<PrivateRoute/>}>
         <Route path="/" element={<General/>} />
          <Route path="/:tipo" element={<General />} />
        </Route>
               
      </Routes>
    </Router>
  );
};

export default AppRoutes;
