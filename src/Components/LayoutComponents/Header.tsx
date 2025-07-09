// src/components/Header.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBell,
  faCog,
  faRightFromBracket ,
  faChevronDown,
  faEdit,
  faMoneyCheckDollar,
} from "@fortawesome/free-solid-svg-icons";
import "../../style/LayoutStyles/dropDown.css";
import "../../style/LayoutStyles/header.css";
import { useAuth } from "../../Auth/AuthContex";
import { logoutUsuario } from "../../services/EliminacionCookie";

// Props para controlar el collapse del sidebar
interface HeaderProps {
  onToggleSidebar: () => void;
  collapsed: boolean;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, collapsed }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { user, token, setUser, setToken, setSelectedMunicipality } = useAuth();

  const userEmail = user?.email ?? user?.nombre ?? "Inicia Sesion";
  const toggleDropdown = () => setIsOpen((o) => !o);


  const handleLogout = async () => {
    try {
      await logoutUsuario(token as string);
    } catch (err) {
      console.error("Error al hacer logout:", err);
    } finally {
      setUser(null);
      setToken("");
      setSelectedMunicipality(null);
      navigate("/");
    }
  };

  return (
    <header className={`header ${collapsed ? "collapsed" : ""}`}>

      {/* IZQUIERDA: hamburger + logo */}
      <div className="header-left">
        <FontAwesomeIcon icon={faBars} className="header-toggle" onClick={() => {
            console.log("hamburguesa clicada en Header");
            onToggleSidebar();}}/>
      </div>

      {/* DERECHA: notificaciones + perfil */}
      <div className="header-right">
      
        <div
          className="user-profile" onClick={toggleDropdown}>
          <img src="/img/usuarios.png" alt="User" className="user-icon" />
          <span className="user-name">{userEmail}</span>
          <FontAwesomeIcon icon={faChevronDown} className="chevron-icon" />

          {isOpen && (
        
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
