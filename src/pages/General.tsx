import React, { FC, Suspense, useState, useEffect } from 'react'
import { replace, useLocation, useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../Components/LayoutComponents/Sidebar';
import Header from '../Components/LayoutComponents/Header'
import '../style/PagesStyles/generalStyles.css'
import { useAuth } from '../Auth/AuthContext';
import { useSessionTimeout } from '../util/UseSessionTimeout';
import NotFound from '../Components/ErrorMessage/NotFound';
//me quede por aqui ya que sera aqui en donde se implementara la logica 
// de los eventos mas la logica de las modales


// Definimos una interfaz para mapear los tipos de servicios a sus componentes correspondientes.
interface Components {
    [key: string]: React.LazyExoticComponent<React.FC>;
}

const Components: Components = {

    //Componentes de Pantallas Landing Dashboard
    'dashboard': React.lazy(() => import('../Components/ImagesComponents/Dashboard')),
    //Componentes de Pantallas Landing de Impuestos
    'bienes-inmuebles': React.lazy(() => import('../Components/ImpuestosComponents/BienesInmueblesDetalles')),
    'impuesto-personal': React.lazy(() => import('../Components/ImpuestosComponents/ImpuestoPersonal')),
    'servicios-publicos': React.lazy(() => import('../Components/ImpuestosComponents/ServiciosPublicos')),
    'industria-comercio': React.lazy(() => import('../Components/ImpuestosComponents/IndustriaComercio')),
    'otras-tasas': React.lazy(() => import('../Components/ImpuestosComponents/OtrasTasasMunicipales')),
    'volumen-ventas': React.lazy(() => import('../Components/PresentacionComponents/DeclaracionesVentas')),
    'renovaciones': React.lazy(() => import('../Components/PresentacionComponents/Renovaciones')),
    'solicitud-inspeccion': React.lazy(() => import('../Components/ServiciosComponents/SolicitudInspeccion')),
    'ambientales': React.lazy(() => import('../Components/ServiciosComponents/Ambientes')),

    //Componentes de Pantalla Periodos de Facturas
    'facturas-BI': React.lazy(() => import('../Components/FacturasComponents/BI-Facturacion')),

    //Componentes de tarjetas
    'tarjetas-guardadas': React.lazy(() => import('../Components/TarjetasComponents/TarjetasGuardadas')),
    'administrador-tarjetas': React.lazy(() => import('../Components/TarjetasComponents/AdministradorTarjetasComponents')),

    //Compoenentes de Dropdown
    'editar-perfil': React.lazy(() => import('../Components/UserComponents/EditarPerfil')),
    'historial-pagos': React.lazy(() => import('../Components/UserComponents/HistorialPagosComponents')),
    //'cambio-contraseña': React.lazy(() => import('../pages/CambioContraseña')),

};

const General: FC = () => {
    // Extraemos el parámetro "tipo" de la URL, por ejemplo: /impuesto-bienes-inmuebles
    const { tipo } = useParams<{ tipo: string }>();
    //console.log("Este es el tipo en general.tsx, ", tipo);

    // Buscamos el componente correspondiente al servicio solicitado.
    const Componente = tipo ? Components[tipo] : null;

    //Todo lo de abajo se agrego para el control de inactividad y ventanas modales segun inactividad
    const [collapsed, setCollapsed] = useState(false)
    const handleToggleSidebar = () => setCollapsed(c => !c);


    //Se configura el hook de sesion con callbacks
    const { Modals, SsExpiredModal, initializeRFSession } = useSessionTimeout({//se importan las modales del sesionTimeOut y tambien la funcion resetSession la 
        // cual limpia y reprograma sus timers basados en el atributo "exp" del JWT lo cual reinicia el reloj de advertencia cuando el 
        // usuario tiene interaccion con la pantalla

        // onRefresh: refreshToken, //onRefresh se ejecutara la funcion para refrescar el token llamada refreshToken
        onExpire: () => {
            // if (!notGeneralLocations.includes(location.pathname)) {
            //     console.log("Location: ", location.pathname);
            //     console.log("Navego a '/' ya que esta en una ruta que se carga en General.tsx")
            window.location.reload(); //se usa en vez de navigate ya que con navigate podemos entrar a la ruta anterior que se carga en cache y puede consumir los endpoints aunque sea una ruta privada y no tenga nada en sessionStorage
            //navigate('/'); //si expira la sesion y la ruta actual NO es una ruta contenida en el arreglo de rutas que no se cargan en General entonces se navega al index
            // } else {
            //     console.log("NO navego a '/' ya que esta en una ruta que NO se carga en General.tsx")
            // }
        },
        isOTimeSession: false,
    });

    useEffect(() => {
        const events = ["mousemove", "touchstart", "scroll"] as const; //se añade as const para que TS 
        // const events = ["mousemove", "keydown", "touchstart", "scroll"] as const; //se añade as const para que TS 
        // infiera una tupla de literales en lugar de un arreglo tipo string "string[]" generico por ende ahora events es inmutable 
        // no se puede alterar ya que es de tipo readonly definiendolo como "as const"
        const onActivity = () => initializeRFSession(); //cada vez que ocurra uno de los eventos de "events" llamamos a
        //  resetSessionTimers que vuelve a programar los warnings  
        events.forEach(e => window.addEventListener(e, onActivity));//se añade un event listener para que ejecute la funcion onActivity con cada uno de los eventos definidos
        //sintaxis de addEventListener = addEventListener(eventName, handler o funcion que se ejecutara con ese evento)
        return () => events.forEach(e => window.removeEventListener(e, onActivity)); //esto garantiza que no queden listeners colgados en memoria después de que el componente sea desmontado
    }, [initializeRFSession]); //resetSessionTimers no cambiara a menos de que una de sus dependencias internas cambien ya que usa useCallback
    //los timers internos de la funcion son los que cambian la funcion de resetSessionTimers como tal no

    return (

        <div className={`app-container ${collapsed ? 'sidebar-collapsed' : ''}`}>
            <Sidebar collapsed={collapsed} />
            <Header collapsed={collapsed} onToggleSidebar={handleToggleSidebar} />
            <div className="generalDiv">
                <Suspense fallback={<div>Cargando Impuesto ...</div>}>
                    {Componente ? (
                        <Componente />
                    ) : (
                        <NotFound />
                    )
                    }
                </Suspense>
            </div >
            {Modals} {/* Este hook se coloca al final del render para que las advertencias aparezcan sobre el layout*/}
            {SsExpiredModal} {/* Este hook se coloca al final del render para que las expiraciones aparezcan sobre el layout*/}
        </div >
    )
}

export default General;