import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginForm from "../pages/LoginForm";
import RegistrarUsuario from "../pages/RegistrarUsuario";

import General from "../pages/General";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Ruta de Login */}
        <Route path="/" element={<LoginForm />} />

        {/* Ruta de Registrar User */}
        <Route path="/registrar-usuario" element={<RegistrarUsuario />} />

        {/* Ruta General con SideBar, Header y Div de Contenido */}
        <Route
          path="/:tipo"
          element={<General />}
        />

      </Routes>
    </Router>
  );
};

export default AppRoutes;
