import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // Obtenemos del contexto no solo user, sino también los setters
  const { user, setUser, setSelectedMunicipality } = useAuth();

  // Elegimos el email o el nombre, o un valor por defecto
  const userEmail = user?.email ?? user?.nombre ?? "admin_admin";

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const gotoMenu = () => {
    navigate("/dashboard");
  };

  const handleLogout = () => {
    //Limpiar estado
    setUser(null);
    setSelectedMunicipality(null);
    // limpiar sessionStorage
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("selectedMunicipality");
    // En este caso se dirigir al login
    navigate("/");
    // Opcional: recargar toda la app para resetear hooks
    // window.location.reload();
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
          <span className="user-name">{userEmail}</span>
          <FontAwesomeIcon icon={faChevronDown} className="chevron-icon" />

          {isOpen && (
            <div className="dropdown-menu">
              <ul className="dropdown-menu-end show">
                <li>
                  <FontAwesomeIcon icon={faEdit} className="menu-icon" />
                  <Link to="/editar-perfil" className="menu-link">
                    Editar Perfil
                  </Link>
                </li>
                <li>
                  <FontAwesomeIcon icon={faCog} className="menu-icon" />
                  <Link to="/soporte-tecnico" className="menu-link">
                    Soporte Técnico
                  </Link>
                </li>
                <li>
                  <FontAwesomeIcon icon={faMoneyCheckDollar} className="menu-icon" />
                  <Link to="/historial-pagos" className="menu-link">
                    Historial Pagos
                  </Link>
                </li>
                <li onClick={handleLogout} style={{ cursor: "pointer" }}>
                  <FontAwesomeIcon icon={faSignOutAlt} className="menu-icon" />
                  <span className="menu-link">Salir</span>
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
