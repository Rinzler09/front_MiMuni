// src/routes/AppRoutes.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";

import LoginForm from "../pages/LoginForm";
import RegistrarUsuario from "../pages/RegistrarUsuario";
import General from "../pages/General";
import CambioContraseña from "../pages/CambioContraseña";
import RecuperarContrasena from "../pages/ReseteoContraseña/RecuperarContrasena";
import RestablecerContrasena from "../pages/ReseteoContraseña/RestablecerContraseña";

// Importamos nuestro PrivateRoute
import PrivateRoute from "./PrivateRoute";

const ProtecionRutas: React.FC = () =>{
  //Ruta de enviar codigo
  const {state} = useLocation() as {state?: {enviado?: boolean}};
  if (!state?.enviado) {
    return <Navigate to="/enviar-codigo" replace/>;
  }
  return <RestablecerContrasena/>;

  // //Ruta para Registro de usuario
  // const {registro} = useLocation() as {registro?: {enviado?: boolean}}
  // if (!registro?.enviado) {
  //   return <Navigate to="/enviar-codigo"/>
  // }
};


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
        {/* Ruta de enviar codigo */}
        <Route path="/enviar-codigo" element={<RecuperarContrasena />}/>
        {/* Ruta de restablecer contraseña  */}
        <Route path="/restablecer-contraseña" element={<ProtecionRutas/>}/>

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