// src/routes/PrivateRoute.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";// Libreria  de react router dom para el manejo de rutas
import { useEffect, useRef } from "react";// hooks de react para efectos segundarios y referencias

const PrivateRoute: React.FC = () => {
  
  const token = sessionStorage.getItem("Token");//Se obtiene desde el sesionStore el token para que valide la parte de si existe un usuario con token para poder pasar la ruta
   const localizacionRuta = useLocation();//Eso nos ayuda a obtener la ubicacion actual de la ruta

  // // Referencias para salto de primer render y ruta previa
  const renderizarPrimero = useRef(true);
   const rutaAnterior = useRef(localizacionRuta.pathname);

  useEffect(() => {
     console.log("Ruta actual:", localizacionRuta.pathname);// Al momento de guardar la ruta actual, se imprime en la console
     if (renderizarPrimero.current) {
       // Primera vez: solo inicializa
       renderizarPrimero.current = false;
     } else {
       // En cambios posteriores dentro de rutas protegidas...
       if (token && localizacionRuta.pathname !== rutaAnterior.current) {
         window.location.reload();//Esto recarga la pagina si el usuario cambia de ruta dentro de las rutas protegidas
       }
     }
     rutaAnterior.current = localizacionRuta.pathname;
   }, [localizacionRuta.pathname, token]);

  // Si no hay user, redirige al login; si hay, renderiza las rutas hijas, la comunicacion  es mediante de la libreria de 
  //react-router-dom, es la version de aplicacion web en navegador/ Document Object Model Es una representacion estructurada de una pagina web que 
  // que el navegador crea cuando carga una pagina HTML
  return token ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
