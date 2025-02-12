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
} from "@fortawesome/free-solid-svg-icons";
import "../../style/metodo.css";

const Sidebar: React.FC = () => {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    Pagos: true,
    Declaraciones: false,
    Servicios: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  return (
    <div className="sidebar-container">
      <div className="sidebar">
        <div className="sidebar-section">
          <h3 className="section-title" onClick={() => toggleSection("Pagos")}>
            Pagos <FontAwesomeIcon icon={faChevronDown} />
          </h3>
          <ul className={`menu-list ${openSections.Pagos ? "show" : ""}`}>
            <li>
              <Link to="/bienes-inmuebles" className="menu-item">
                <FontAwesomeIcon icon={faHome} className="menu-icon" />
                BI-Bienes Inmuebles
              </Link>
            </li>
            <li>
              <Link to="/impuesto-personal" className="menu-item">
                <FontAwesomeIcon icon={faUser} className="menu-icon" />
                IP-Impuesto Personal (Vecinal)
              </Link>
            </li>
            <li>
              <Link to="/servicios-publicos" className="menu-item">
                <FontAwesomeIcon icon={faBuilding} className="menu-icon" />
                SP-Servicios Públicos
              </Link>
            </li>
            <li>
              <Link to="/industria-comercio" className="menu-item">
                <FontAwesomeIcon icon={faIndustry} className="menu-icon" />
                ICS-Industria, Comercio y Servicios
              </Link>
            </li>
            <li>
              <Link to="/otras-tasas" className="menu-item">
                <FontAwesomeIcon icon={faTrash} className="menu-icon" />
                Otras Tasas Municipales
              </Link>
            </li>
          </ul>
        </div>

        <div className="sidebar-section">
          <h3
            className="section-title"
            onClick={() => toggleSection("Declaraciones")}
          >
            Presentación declaraciones <FontAwesomeIcon icon={faChevronDown} />
          </h3>
          <ul
            className={`menu-list ${openSections.Declaraciones ? "show" : ""}`}
          >
            <li>
              <Link to="/volumen-ventas" className="menu-item">
                <FontAwesomeIcon icon={faFileAlt} className="menu-icon" />
                Declaración Volumen de Ventas
              </Link>
            </li>

            <li>
              <Link to="/renovaciones" className="menu-item">
                <FontAwesomeIcon icon={faRepeat} className="menu-icon" />
                Renovaciones
              </Link>
            </li>
          </ul>
        </div>

        <div className="sidebar-section">
          <h3
            className="section-title"
            onClick={() => toggleSection("Servicios")}
          >
            Servicios Municipales <FontAwesomeIcon icon={faChevronDown} />
          </h3>
          <ul className={`menu-list ${openSections.Servicios ? "show" : ""}`}>
            <li>
              <Link to="/solicitud-inspeccion" className="menu-item">
                <FontAwesomeIcon icon={faSearch} className="menu-icon" />
                Solicitud de Inspección
              </Link>
            </li>
            <li>
              <Link to="/ambientales" className="menu-item">
                <FontAwesomeIcon icon={faLeaf} className="menu-icon" />
                Ambientales
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
