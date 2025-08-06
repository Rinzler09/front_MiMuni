// src/components/Layout.tsx
import React, { useState } from 'react';//Importamos el hook useState de react para poder manejar los estados del sidebar y el header
import Header from './Header';//Importamos el componente Header
import Sidebar from './Sidebar';//Importamos el componente Sidebar
import { Outlet } from 'react-router-dom';//En este caso vamos importar Outlet de react-router-dom para que podamos renderizar las rutas hijas dentro del layout
import '../../style/LayoutStyles/layout.css';//La importancion del css del Layout

const Layout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);//Declaramos una constante que sera un estado collapsed, en este caso estara,
  //inicializada false para que cuando se renderice el sidebar este desplegado por defecto.
  const handleToggleSidebar = () => setCollapsed(c => !c);// En este coso declaramos una funcion handleToggleSidebar,en este caso 
  //Estamos usando una arrow function sin parametros cada vez que invoque hanldeToggleSidebar se estara ejecutando 
  //la funcion de setCollapsed esto es lo que cambia el estado de collapsed del sidebar al contrario.


  return (
    <div className={`app-container ${collapsed ? 'sidebar-collapsed' : ''}`}>{/* En este caso tenemos un div
    que contiene una claseName en este caso tenemos una interpolacion valores dinamicos de la cadena.
    dentro de la interpolarizacion expresa una condicion, si el collapsed es true se le agregar la clase sidebar-collapsed
    si es false no se le agregara nada o viene vacia.
     */}
      <Sidebar collapsed={collapsed} />{/**Tenemos el Sidebar que le pasa los prop de collapsed para que sepa que se debe mostrar normal
       * cuando el collapsed sea true se mostrara el sidebar collapsado
       */}

      <main className="main-content">{/*En este caso tenemos un div con una claseName personalizada
       *Dentro de este div tenemos un header en donde le pasamos los props
      */}
        
        <Header //En este caso tenemos el header que va pasar dos props para que pueda comunicar entre el header y el sidebar
          collapsed={collapsed}//El primer props es el collapsed que pasamos el estado del sidebar 
          onToggleSidebar={handleToggleSidebar}//En este caso tenemos el segundo props que es el onToggleSidebar, en este caso tenemos 
          //que hace funcion para que el header debe hacer clic para poder cambiar el estado del collapsed del sidebar.
        />
        <div className="outlet-container"> {/*En este caso tenemos un div que este caso sera el contenedor del Outlet */}
          <Outlet /> {/*En este caso tenemos el placeholder en donde se inyectara el contenido de las rutas hijas actuales que estan en el Route
          *Esto es para que las rutas hijas puedan tener el colapsed del sidebar y el header.
          */}
        </div>
      </main>
    </div>
  );
};

export default Layout;
