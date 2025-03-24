import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faCog,
  faSignOutAlt,
  faChevronDown,
  faEdit,
  faMoneyCheckDollar,
} from "@fortawesome/free-solid-svg-icons";
import "../../style/LayoutStyles/dropDown.css";
import "../../style/LayoutStyles/header.css";
import { useAuth } from "../../Auth/AuthContex";

const Header: React.FC = () => {
  const navigate = useNavigate(); // Hook para navegación
  const [isOpen, setIsOpen] = useState(false);

  // Obtenemos el usuario desde el AuthContext (sin usar localStorage)
  const { user } = useAuth();

  // Si tienes la propiedad "email" en el objeto user, úsala;
  // de lo contrario, se usa "nombre" o un valor por defecto.
  const userEmail = user ? (user.email ? user.email : user.email) : "admin_admin";

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const gotoMenu = () => {
    navigate("/dashboard");
  };

  return (
    <header className="header d-flex justify-content-between align-items-center p-1">
      <div className="header-left">
        <h1 className="header-title tituloHeader" onClick={gotoMenu}>
          Mi Muni en Línea
        </h1>
      </div>

      <div className="header-right">
        <div className="user-profile" onClick={toggleDropdown}>
          <FontAwesomeIcon icon={faUser} className="user-icon" />
          <span className="user-name">{userEmail}</span>{" "}
          <FontAwesomeIcon icon={faChevronDown} className="chevron-icon" />
          {/* Menú desplegable */}
          {isOpen && (
            <div className="dropdown-menu">
              <ul className="dropdown-menu-end show">
                <li>
                  <FontAwesomeIcon icon={faEdit} className="menu-icon" />
                  <a href="/editar-perfil" className="menu-link">
                    Editar Perfil
                  </a>
                </li>
                <li >
                  <FontAwesomeIcon icon={faCog} className="menu-icon" />
                  <a href="/soporte-tecnico" className="menu-link">
                    Soporte Técnico
                  </a>
                </li>
                <li >
                  <FontAwesomeIcon icon={faMoneyCheckDollar} className="menu-icon" />
                  <a href="/historial-pagos" className="menu-link">
                    Historial de Pagos
                  </a>
                </li>
                <li >
                  <FontAwesomeIcon icon={faSignOutAlt} className="menu-icon" />
                  <a href="/" className="menu-link">
                    Salir
                  </a>
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
