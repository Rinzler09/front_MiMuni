import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUser,
  faBuilding,
  faIndustry,
  faTrash,
  faFileAlt,
  faSearch,
  faLeaf,
  faChevronDown,
  faRepeat,
  faBars, // Ícono de hamburguesa
} from "@fortawesome/free-solid-svg-icons";
import "../../style/LayoutStyles/sidebar.css";

const Sidebar: React.FC = () => {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    EstadoCuenta: true,
    Declaraciones: false,
    Servicios: false,
    Ambientales: false,
    Municipalidades: false,
    Publicos: false,
    Varios: false,
  });
  
  // Estado para controlar la visibilidad de la sidebar en móviles
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSection = (section: string) => {
    setOpenSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  // Método para alternar la visibilidad de la sidebar (para el ícono de hamburguesa)
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div>
      {/* Ícono de hamburguesa visible en dispositivos móviles */}
      <div className="hamburger-icon" onClick={toggleSidebar}>
        <FontAwesomeIcon icon={faBars} />
      </div>

      {/* Contenedor de la barra lateral con clase condicional */}
      <div className={`sidebar-container ${isSidebarOpen ? "active" : ""}`}>
        <div className="sidebar">
          <div className="sidebar-section">
            <h3
              id="btnMunicipalidades"
              className={`section-title ${openSections.Municipalidades ? "active" : ""}`}
              onClick={() => toggleSection("Municipalidades")}
            >
              Municipalidades <FontAwesomeIcon icon={faChevronDown} />
            </h3>
            <ul className={`menu-list ${openSections.Municipalidades ? "show" : ""}`}>
              <li>
                <Link to="/dashboard" className="menu-item">
                  Santa Lucía
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="menu-item">
                  Valle de Angeles
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="menu-item">
                  Choluteca
                </Link>
              </li>
            </ul>
          </div>

          <div className="sidebar-section">
            <h3 className="section-title" onClick={() => toggleSection("EstadoCuenta")}>
              Estado de Cuenta <FontAwesomeIcon icon={faChevronDown} />
            </h3>
            <ul className={`menu-list ${openSections.EstadoCuenta ? "show" : ""}`}>
              <li>
                <Link to="/bienes-inmuebles" className="menu-item">
                  <FontAwesomeIcon icon={faHome} className="menu-icon" />
                  Bienes Inmuebles
                </Link>
              </li>
              <li>
                <Link to="/impuesto-personal" className="menu-item">
                  <FontAwesomeIcon icon={faUser} className="menu-icon" />
                  Impuesto Vecinal
                </Link>
              </li>
              <li>
                <Link to="/servicios-publicos" className="menu-item">
                  <FontAwesomeIcon icon={faBuilding} className="menu-icon" />
                  Servicios Públicos
                </Link>
              </li>
              <li>
                <Link to="/industria-comercio" className="menu-item">
                  <FontAwesomeIcon icon={faIndustry} className="menu-icon" />
                  Impuesto Negocios
                </Link>
              </li>
              <li>
                <Link to="/otras-tasas" className="menu-item">
                  <FontAwesomeIcon icon={faTrash} className="menu-icon" />
                  Multas Municipales
                </Link>
              </li>
              <li>
                <Link to="/otras-tasas" className="menu-item">
                  <FontAwesomeIcon icon={faTrash} className="menu-icon" />
                  Servicios Varios
                </Link>
              </li>
            </ul>
          </div>

          <div className="sidebar-section">
            <h3 className="section-title" onClick={() => toggleSection("Declaraciones")}>
              Servicios Tributarios <FontAwesomeIcon icon={faChevronDown} />
            </h3>
            <ul className={`menu-list ${openSections.Declaraciones ? "show" : ""}`}>
              <li>
                <Link to="/volumen-ventas" className="menu-item">
                  <FontAwesomeIcon icon={faFileAlt} className="menu-icon" />
                  Solvencia Vecinal
                </Link>
              </li>
              <li>
                <Link to="/renovaciones" className="menu-item">
                  <FontAwesomeIcon icon={faRepeat} className="menu-icon" />
                  Permiso operación negocios
                </Link>
              </li>
              <li>
                <Link to="/renovaciones" className="menu-item">
                  <FontAwesomeIcon icon={faRepeat} className="menu-icon" />
                  Impuesto volumen ventas
                </Link>
              </li>
              <li>
                <Link to="/renovaciones" className="menu-item">
                  <FontAwesomeIcon icon={faRepeat} className="menu-icon" />
                  Cambio de propietario
                </Link>
              </li>
              <li>
                <Link to="/renovaciones" className="menu-item">
                  <FontAwesomeIcon icon={faRepeat} className="menu-icon" />
                  Cambio de giro negocio
                </Link>
              </li>
              <li>
                <Link to="/renovaciones" className="menu-item">
                  <FontAwesomeIcon icon={faRepeat} className="menu-icon" />
                  Cambio de negocio
                </Link>
              </li>
              <li>
                <Link to="/renovaciones" className="menu-item">
                  <FontAwesomeIcon icon={faRepeat} className="menu-icon" />
                  Planes de Pago
                </Link>
              </li>
            </ul>
          </div>

          <div className="sidebar-section">
            <h3 className="section-title" onClick={() => toggleSection("Servicios")}>
              Servicios Catastrales <FontAwesomeIcon icon={faChevronDown} />
            </h3>
            <ul className={`menu-list ${openSections.Servicios ? "show" : ""}`}>
              <li>
                <Link to="/solicitud-inspeccion" className="menu-item">
                  <FontAwesomeIcon icon={faSearch} className="menu-icon" />
                  Solicitud de Permiso de Construccion
                </Link>
              </li>
              <li>
                <Link to="/ambientales" className="menu-item">
                  <FontAwesomeIcon icon={faLeaf} className="menu-icon" />
                  Constancias Catastrales
                </Link>
              </li>
              <li>
                <Link to="/ambientales" className="menu-item">
                  <FontAwesomeIcon icon={faLeaf} className="menu-icon" />
                  Solicitud de Inspecciones
                </Link>
              </li>
              <li>
                <Link to="/ambientales" className="menu-item">
                  <FontAwesomeIcon icon={faLeaf} className="menu-icon" />
                  Planos Catastrales
                </Link>
              </li>
            </ul>
          </div>

          <div className="sidebar-section">
            <h3 className="section-title" onClick={() => toggleSection("Ambientales")}>
              Servicios Ambientales <FontAwesomeIcon icon={faChevronDown} />
            </h3>
            <ul className={`menu-list ${openSections.Ambientales ? "show" : ""}`}>
              <li>
                <Link to="/solicitud-inspeccion" className="menu-item">
                  <FontAwesomeIcon icon={faSearch} className="menu-icon" />
                  Inspecciones Ambientales
                </Link>
              </li>
              <li>
                <Link to="/ambientales" className="menu-item">
                  <FontAwesomeIcon icon={faLeaf} className="menu-icon" />
                  Constancias Ambientales
                </Link>
              </li>
              <li>
                <Link to="/ambientales" className="menu-item">
                  <FontAwesomeIcon icon={faLeaf} className="menu-icon" />
                  Permisos Ambientales
                </Link>
              </li>
            </ul>
          </div>

          <div className="sidebar-section">
            <h3 className="section-title" onClick={() => toggleSection("Publicos")}>
              Servicios Públicos <FontAwesomeIcon icon={faChevronDown} />
            </h3>
            <ul className={`menu-list ${openSections.Publicos ? "show" : ""}`}>
              <li>
                <Link to="/solicitud-inspeccion" className="menu-item">
                  <FontAwesomeIcon icon={faSearch} className="menu-icon" />
                  Cambio de Propietario
                </Link>
              </li>
              <li>
                <Link to="/ambientales" className="menu-item">
                  <FontAwesomeIcon icon={faLeaf} className="menu-icon" />
                  Cambio de Domicilio
                </Link>
              </li>
              <li>
                <Link to="/ambientales" className="menu-item">
                  <FontAwesomeIcon icon={faLeaf} className="menu-icon" />
                  Libro de Quejas
                </Link>
              </li>
              <li>
                <Link to="/ambientales" className="menu-item">
                  <FontAwesomeIcon icon={faLeaf} className="menu-icon" />
                  Planes de Pago
                </Link>
              </li>
              <li>
                <Link to="/ambientales" className="menu-item">
                  <FontAwesomeIcon icon={faLeaf} className="menu-icon" />
                  Solicitud de Servicio
                </Link>
              </li>
            </ul>
          </div>

          <div className="sidebar-section">
            <h3 className="section-title" onClick={() => toggleSection("Varios")}>
              Servicios Varios <FontAwesomeIcon icon={faChevronDown} />
            </h3>
            <ul className={`menu-list ${openSections.Varios ? "show" : ""}`}>
              <li>
                <Link to="/solicitud-inspeccion" className="menu-item">
                  <FontAwesomeIcon icon={faSearch} className="menu-icon" />
                  Constancias Municipales
                </Link>
              </li>
              <li>
                <Link to="/ambientales" className="menu-item">
                  <FontAwesomeIcon icon={faLeaf} className="menu-icon" />
                  Certificaciones
                </Link>
              </li>
              <li>
                <Link to="/ambientales" className="menu-item">
                  <FontAwesomeIcon icon={faLeaf} className="menu-icon" />
                  Licencias
                </Link>
              </li>
              <li>
                <Link to="/ambientales" className="menu-item">
                  <FontAwesomeIcon icon={faLeaf} className="menu-icon" />
                  Permisos de Explotación
                </Link>
              </li>
              <li>
                <Link to="/ambientales" className="menu-item">
                  <FontAwesomeIcon icon={faLeaf} className="menu-icon" />
                  Vistos Buenos
                </Link>
              </li>
              <li>
                <Link to="/ambientales" className="menu-item">
                  <FontAwesomeIcon icon={faLeaf} className="menu-icon" />
                  Cartas de Ventas
                </Link>
              </li>
              <li>
                <Link to="/ambientales" className="menu-item">
                  <FontAwesomeIcon icon={faLeaf} className="menu-icon" />
                  Guías de Transporte
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
