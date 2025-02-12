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
// import "../../style/prueba.css"; // Asegúrate de que el archivo CSS esté bien referenciado
import "../../style/dropDown.css";

const Header: React.FC = () => {
  const navigate = useNavigate(); /*Hook de navigate*/
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("admin_admin"); // Valor por defecto

  useEffect(() => {
    // Recuperar los datos del usuario del localStorage
    const user = localStorage.getItem("usuario");
    if (user) {
      const parsedUser = JSON.parse(user);
      console.log("Datos parseados:", parsedUser); // Depuración
      // setUserName(parsedUser.usuarioname || "admin_admin"); // Usa 'usuarioname' en lugar de 'username'
      setUserName(parsedUser || "admin_admin");
    } else {
      console.log("No se encontró el usuario en localStorage.");
    }
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const gotoMenu = () => {
    navigate("/dashboard");
  };

  return (
    <header className="header">
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
            <div className="dropdown-menu">
              <ul>
                <li className="dropdown-menu-list">
                  <FontAwesomeIcon icon={faEdit} className="menu-icon" />
                  <a href="/editar-perfil" className="menu-link">
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
