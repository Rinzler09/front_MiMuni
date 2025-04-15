import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginForm from "../pages/LoginForm";
import RegistrarUsuario from "../pages/RegistrarUsuario";
import General from "../pages/General";
import CambioContraseña from "../pages/CambioContraseña";

import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import ProceosFacturacion from "../Components/ImpuestosComponents/IndustriaComercio";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
     
        {/* Rutas públicas sin protección extra */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<LoginForm />} />
          <Route path="/registrar-usuario" element={<RegistrarUsuario />} />
          {/* Incluso la ruta de cambio de contraseña no se permitirá si el usuario está autenticado */}
          <Route path="/cambio-contraseña" element={<CambioContraseña />} />
        {/* <Route path="/facturas-BI" element={<ProceosFacturacion />} />*/}
        </Route>
        
        {/* Rutas protegidas para usuarios autenticados */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<General />} />
          <Route path="/:tipo" element={<General />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
