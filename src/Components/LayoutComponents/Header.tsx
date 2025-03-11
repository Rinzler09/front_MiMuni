import React, { useState, useEffect } from "react";
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

const Header: React.FC = () => {
  const navigate = useNavigate(); /*Hook de navigate*/
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("admin_admin"); // Valor por defecto

  useEffect(() => {
    // Recuperar el email del localStorage
    const userEmail = localStorage.getItem("user");
    if (userEmail) {
      console.log("Email recuperado de localStorage:", userEmail); // Depuración
      setUserName(userEmail || "admin_admin"); // Usa el email directamente
    } else {
      console.log("No se encontró el email en localStorage.");
    }
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const gotoMenu = () => {
    navigate("/dashboard");
  };

  return (
    <header className="header d-flex justify-content-between align-items-center p-1 ">
      <div className="header-left">
        <h1 className="header-title tituloHeader" onClick={gotoMenu}>
          Mi Muni en Línea
        </h1>
      </div>

      <div className="header-right">
        <div className="user-profile" onClick={toggleDropdown}>
          <FontAwesomeIcon icon={faUser} className="user-icon" />
          <span className="user-name">{userName}</span>{" "}
          <FontAwesomeIcon icon={faChevronDown} className="chevron-icon" />
          {/* Menú desplegable */}
          {isOpen && (
            <div className="dropdown-menu ">
              <ul className="dropdown-menu-end show">
                <li >
                  <FontAwesomeIcon icon={faEdit} className="menu-icon" />
                  <a href="/editar-perfil" className="dropdown-menu-item">
                    Editar Perfil
                  </a>
                </li>
                <li className="dropdown-menu-list">
                  <FontAwesomeIcon icon={faCog} className="menu-icon" />
                  <a href="/soporte-tecnico " className="menu-link">
                    Soporte Tecnico
                  </a>
                </li>
                <li className="dropdown-menu-list">
                  <FontAwesomeIcon
                    icon={faMoneyCheckDollar}
                    className="menu-icon"
                  />
                  <a href="/historial-pagos " className="menu-link">
                    Historial de Pagos
                  </a>
                </li>
                <li className="dropdown-menu-list">
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