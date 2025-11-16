// src/components/Header.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBell,
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
  const [isOpen, setIsOpen] = useState(false);
  const { user, token, setUser, setToken, setSelectedMunicipality, selectedMunicipality } = useAuth();
  const userEmail = user?.email ?? "Inicia Sesion";
  const toggleDropdown = () => setIsOpen((o) => !o);

  const handleRestrictedClick = (e: React.MouseEvent) => {//Esta funcion sirve para el bloqueo de submenus en el dropdown si no se selecciono una municipalidad
    if (!selectedMunicipality) {
      e.preventDefault();// No se puede selecionar ningun submenu al momento de no tenenr una municipalidad seleccionada
    }
  };

  const restrictedLinkProps = !selectedMunicipality/**En este caso restrictedLinkProps sera un objeto con propiedades*/
    ? { onClick: handleRestrictedClick, className: "menu-link disabled" }//Asigna un manejador que ejecuta e.preventDefault() si el usuario intenta hacer clic sin haber elegido municipio, bloqueando la acción (por ejemplo, evitar la navegación).
    : { className: "menu-link" }; //Esto es para que menu-item, sin handler extra ni estilo de “deshabilitado” el enlace o botón funciona como normal.

  const handleLogout = async () => {
    try {
      await logoutUsuario(token as string);
    } catch (err) {
      console.error("Error al hacer logout:", err);
    } finally {
      console.log("Entro a handleLogOut")
      setUser(null);
      setToken(null);
      setSelectedMunicipality(null);
      navigate("/"); //navigate si esta funcionando aqui no es necesario el .reload(), probablemente por el finally

    }
  };

  return (
    <header className={`header ${collapsed ? "collapsed" : ""}`}>
      {/* IZQUIERDA: hamburger + logo */}
      <div className="header-left">
        <FontAwesomeIcon icon={faBars}
          className="header-hamburger"
          onClick={() => {
            onToggleSidebar();
          }} />

      </div>


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

                <li title={`${restrictedLinkProps.className === "menu-link disabled" ? "Por favor, selecciona una municipalidad para comenzar." : ""}`}>
                  <Link to="/historial-pagos"
                    {...restrictedLinkProps}
                    // className="menu-link" previously before changed 
                    className={` ${restrictedLinkProps.className === "menu-link disabled" ? restrictedLinkProps.className : "menu-link"}`}
                    style={{ display: 'flex', alignItems: 'center' }}>
                    <FontAwesomeIcon icon={faMoneyCheckDollar} className="menu-icon" />
                    <span className="ms-2">Historial de Pagos</span>
                  </Link>
                </li>
                <li style={{ padding: 0 }}>
                  <span onClick={handleLogout}
                    className="menu-link" style={{ display: 'flex', alignItems: 'center' }}>
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
