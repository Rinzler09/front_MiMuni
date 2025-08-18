import { Outlet } from "react-router-dom";

//se probo utilizar rutas publicas para tratar de solucionar el error del LoginForm
//  en el cual se deshabilitan los inputs tras cerrar sesion 
export default function PublicRoutes() {
    return <Outlet />; // sin Suspense, sin modales (los cuales se usan en las rutas privadas) solo renderiza las rutas publicas 
}