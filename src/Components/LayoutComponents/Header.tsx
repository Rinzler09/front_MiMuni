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
// import { useSessionTimeout } from "../../hook/UseSessionTimeout";

// Props para controlar el collapse del sidebar
interface HeaderProps {
  collapsed: boolean;
  onToggleSidebar: () => void;

}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, collapsed }) => {
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
      navigate("/"); //navigate si esta funcionando aqui no es necesario el .reload(), probablemente por el finally
      //window.location.reload(); //se usa en vez de navigate ya que con navigate podemos entrar a la ruta anterior que se carga en cache y puede consumir los endpoints aunque sea una ruta privada y no tenga nada en sessionStorage

    }
  };

  return (
    <header className={`header ${collapsed ? "collapsed" : ""}`}>{/* En este caso tenemos un div
    que contiene una claseName en este caso tenemos una interpolacion valores dinamicos de la cadena.
    dentro de la interpolarizacion expresa una condicion, si el collapsed es true se le agregar la clase sidebar-container y aplica la parte
    *de collapsed si es false no se le agregara nada o viene vacia.*/}
      {/* IZQUIERDA: hamburger + logo */}
      <div className="header-left">
        <FontAwesomeIcon icon={faBars}
          className="header-hamburger"
          onClick={() => {
            onToggleSidebar();
          }} />

        {/* Si más adelante quieres el search, descomenta */}
        {/* <div className="header-search">
          <input type="text" placeholder="Search..." />
          <FontAwesomeIcon icon={faSearch} className="fa-search" />
        </div> */}
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
                    <span className="ms-2">Cerrar sesión</span>
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
