import React, { FC, Suspense } from 'react'
import { useParams } from 'react-router-dom';
import Sidebar from '../Components/LayoutComponents/Sidebar'
import Header from '../Components/LayoutComponents/Header'
import '../style/generalPage.css'

// Definimos una interfaz para mapear los tipos de servicios a sus componentes correspondientes.
interface Components {
    [key: string]: React.LazyExoticComponent<React.FC>;
}

const Components: Components = {

    //Componentes de Pantallas Landing Dashboard
    'dashboard': React.lazy(() => import('../Components/Dashboard/Dashboard')),
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
    'facturasBI': React.lazy(() => import('../Components/FacturasComponents/ProcesoFacturacionComponents')),

    //Componentes de tarjetas
    'tarjetas-guardadas': React.lazy(() => import('../Components/TarjetasComponents/TarjetasGuardadas')),
    'administrador-tarjetas': React.lazy(() => import('../Components/TarjetasComponents/AdministradorTarjetasComponents')),

    //Compoenentes de Dropdown
    'editar-perfil': React.lazy(() => import('../Components/UserComponents/EditarPerfil')),
    'historial-pagos': React.lazy(() => import('../Components/UserComponents/HistorialPagosComponents')),



};

const General: FC = () => {
    // Extraemos el parámetro "tipo" de la URL, por ejemplo: /impuesto-bienes-inmuebles
    const { tipo } = useParams<{ tipo: string }>();
    console.log(tipo);

    // Buscamos el componente correspondiente al servicio solicitado.
    const Componente = tipo ? Components[tipo] : null;

    return (
        <div>
            <Sidebar />
            <Header />
            <div className="generalDiv">
                <Suspense fallback={<div>Cargando Impuesto ...</div>}>
                    {Componente ? (
                        <Componente />
                    ) : (
                        <div>Componente no encontrado</div>
                    )
                    }
                </Suspense>
            </div>
        </div>
    )
}

export default General;