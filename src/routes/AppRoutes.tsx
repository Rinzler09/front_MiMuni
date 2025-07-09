// src/routes/AppRoutes.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginForm from "../pages/LoginForm";
import RegistrarUsuario from "../pages/RegistrarUsuario";
import General from "../pages/General";
import CambioContrasena from "../pages/CambioContrasena";
import RecuperarContrasena from "../pages/ReseteoContraseña/RecuperarContrasena";
import RestablecerContrasena from "../pages/ReseteoContraseña/RestablecerContraseña";

// Importamos nuestro PrivateRoute
import PrivateRoute from "./PrivateRoute";


const AppRoutes: React.FC = () => {
  return (
    
    <Router>
      <Routes>
        {/* Ruta de Login */}
        <Route path="/" element={<LoginForm />} />
         {/* Ruta de Registrar Usuario */}
        <Route path="/registrar-usuario" element={<RegistrarUsuario />} />
        {/* Ruta de Cambio de Contraseña */}
       
        {/* Ruta de enviar codigo */}
        <Route path="/enviar-codigo" element={<RecuperarContrasena />}/>
        
        
        {/* Ruta protegida: :tipo */}
        <Route element={<PrivateRoute />}>
          <Route path=":tipo" element={<General />} />
          <Route path="cambio-contrasena" element={<CambioContrasena />} />
          <Route path="restablecer-contraseña" element={<RestablecerContrasena/>}/>
        </Route>
               
      </Routes>
    </Router>
  );
};

export default AppRoutes;