// src/components/Header.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faRightFromBracket,
  faChevronDown,
  faEdit,
  faMoneyCheckDollar,
} from "@fortawesome/free-solid-svg-icons";
import "../../style/LayoutStyles/dropDown.css";
import "../../style/LayoutStyles/header.css";
import { useAuth } from "../../Auth/AuthContext";
import { logoutUsuario } from "../../services/EliminacionCookie";



 interface HeaderProps {  //En esta parte tenemos declara una interface en donde vamos a pasar los props al header que viene del Layout
  collapsed: boolean;//En este caso el collapsed es un booleano que nos indica que si el sidebar esta colpsado o no queriendo decir 
                      //que si es true el sidebar esta colpsado y si es false el sidebar esta desplegado correctamente
   onToggleSidebar: () => void; //En esta parte estamos usando una funcion que se llama onToggleSidebar,
   //Es una funcion que no recibe parametros y no retorna nada, es un callback que viene de Layout que es el padre
   //esto es cuando se ejecuta la funcion para que el sidebar colapse o se vuelva desplegar, queriendo decir que no pasa 
   //Ningun dato solo le dice a Layout que se debe ejecute el estado desde Layout.tsx
   
 }

export const Header: React.FC<HeaderProps> = ({ collapsed, onToggleSidebar }) => {{/*En este caso vamos declarar el SidebarPROPS para que 
  *poder pasarle lo que esta diciendo que esa esperando un tipo.
  *Tambien tenemos la parte de ({collapsed}) es la destructuracion de los prop ya que con esta manera podemos acceder directamente el valor
  *Sin necesidad de usar constante en donde podeamos declarar el prop.collapsed.
  *En este caso tenemos el onToggleSidebar que es una funcion cuando que es de callback que se ejecuta cuando se quiere alternar 
  El estado de colpasar/expandir el sidebar tipicamente disparada por un evento de clic
  */}
  //console.log("Header PROPS:", collapsed, onToggleSidebar); //Esto es para que se pueda ver en la consola los props que se estan pasando al header

  const navigate = useNavigate();
  const [isOpen, setOpen] = useState(false);// Estado para el dropdown
  const { user, token, setUser, setToken, setSelectedMunicipality } = useAuth();
  
  const userEmail = user?.email ?? "Inicia Sesion";

  const toggleDropdown = () => setOpen(open => !open);//Esta función cambia el estado del dropdown
  
  //funcion para manejar el clic en el icono del menú
  const handleClick = () =>{
  onToggleSidebar(); 
  }


  const handleLogout = async () => {
    try {
      await logoutUsuario(token as string);
    } catch (err) {
     // console.error("Error al hacer logout:", err);
    } finally {
      //console.log("Entro a handleLogOut")
      setUser(null);
      setToken(null);
      setSelectedMunicipality(null);
      // handleExpire(); me genera problemas porque carga dos veces el useSessionTimeOut en la misma pantalla que es General.tsx
      navigate("/");
    }
  };

  return (
    <header className={`header ${collapsed ? "collapsed" : ""}`}>{/* En este caso tenemos un div
    que contiene una claseName en este caso tenemos una interpolacion valores dinamicos de la cadena.
    dentro de la interpolarizacion expresa una condicion, si el collapsed es true se le agregar la clase sidebar-container y aplica la parte
    *de collapsed si es false no se le agregara nada o viene vacia.*/}
      {/* IZQUIERDA: hamburger + logo */}
      <div className="header-left">
       <FontAwesomeIcon 
            icon={faBars}
            className="header-hamburger"
            onClick={() => {
              handleClick();
            }}/>
      </div>

     
      <div className="header-right">

        <div
          className="user-profile" onClick={toggleDropdown}>
          <img src="/img/usuarios.png" alt="User" className="user-icon" />
          <span className="user-name">{userEmail}</span>
          <FontAwesomeIcon icon={faChevronDown} className="chevron-icon" />

          {isOpen  && (

            <div className="dropdown-menu">

              <ul className="dropdown-menu-end show">
                <li>
                  <Link to="/editar-perfil" className="menu-link" style={{ display: 'flex', alignItems: 'center' }}>
                    <FontAwesomeIcon icon={faEdit} className="menu-icon" />
                    <span className="ms-2">Restablecer Contraseña</span>
                  </Link>
                </li>

                <li>
                  <Link to="/historial-pagos" className="menu-link" style={{ display: 'flex', alignItems: 'center' }}>
                    <FontAwesomeIcon icon={faMoneyCheckDollar} className="menu-icon" />
                    <span className="ms-2">Historial Pagos</span>
                  </Link>
                </li>
                <li style={{ padding: 0 }}>
                  <span onClick={handleLogout}
                    className="menu-link" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <FontAwesomeIcon icon={faRightFromBracket} className="menu-icon" />
                    <span className="ms-2">Salir</span>
                  </span>
                </li>
              </ul>
            </div>


          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
