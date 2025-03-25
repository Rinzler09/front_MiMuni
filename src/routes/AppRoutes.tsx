// src/routes/AppRoutes.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginForm from "../pages/LoginForm";
import RegistrarUsuario from "../pages/RegistrarUsuario";
import General from "../pages/General";
import CambioContraseña from "../pages/CambioContraseña";

// Importamos nuestro PrivateRoute
import PrivateRoute from "./PrivateRoute";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<LoginForm />} />
        <Route path="/registrar-usuario" element={<RegistrarUsuario />} />
        <Route path="/cambio-contraseña" element={<CambioContraseña />} />

        {/* Ruta protegida: :tipo */}
        <Route element={<PrivateRoute />}>
         <Route path="/cambio-contraseña" element={<CambioContraseña />} />
          <Route path="/:tipo" element={<General />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
