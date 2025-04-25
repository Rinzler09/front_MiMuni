import React, { useState, useEffect } from "react";
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
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import "../../style/LayoutStyles/sidebar.css";
import { useAuth } from "../../Auth/AuthContex";
import { Toaster, toast } from "sonner";
import { clavesCatastrales } from "../../services/claveCatastral";

const Sidebar: React.FC = () => {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    EstadoCuenta: false,
    Declaraciones: false,
    Servicios: false,
    Ambientales: false,
    Municipalidades: true,
    Publicos: false,
    Varios: false,
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, selectedMunicipality, setSelectedMunicipality } = useAuth();

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const municipalidades = user?.municipalidades || [];

  // Keep-alive inmediato al cambiar de municipio
  useEffect(() => {
    if (!user?.token || !selectedMunicipality) return;
    const token = user.token;
    const municipality = selectedMunicipality;
    (async () => {
      try {
        await clavesCatastrales(municipality, token);
      } catch (err) {
        console.warn("Keep-alive fallido:", err);
      }
    })();
  }, [user?.token, selectedMunicipality]);

  // Heartbeat periódico cada 4 minutos
  useEffect(() => {
    if (!user?.token || !selectedMunicipality) return;
    const token = user.token;
    const municipality = selectedMunicipality;
    const intervalId = setInterval(() => {
      clavesCatastrales(municipality, token).catch(err =>
        console.warn("Heartbeat fallido:", err)
      );
    }, 4 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [user?.token, selectedMunicipality]);

  // Selección de municipalidad con toast
  const handleMunicipalitySelect = (
    municipality: string,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedMunicipality(municipality);
    toast.success(`${municipality} seleccionada.`);
  };

  const handleRestrictedClick = (e: React.MouseEvent) => {
    if (!selectedMunicipality) {
      e.preventDefault();
    }
  };

  const restrictedLinkProps = !selectedMunicipality
    ? { onClick: handleRestrictedClick, className: "menu-item disabled" }
    : { className: "menu-item" };

  // Notifica si no hay municipio tras login
  useEffect(() => {
    if (user && !selectedMunicipality) {
      setTimeout(() => {
        toast.info(
          "Por favor, seleccione una municipalidad para continuar con el proceso de pago."
        );
      }, 3000);
    }
  }, [user, selectedMunicipality]);

  
  return (
    <div>
      <Toaster richColors position="top-right" />
      
      {/* Ícono de hamburguesa para móviles */}
      <div className="hamburger-icon" onClick={toggleSidebar}>
        <FontAwesomeIcon icon={faBars} />
      </div>

      {/* Contenedor del sidebar */}
      <div className={`sidebar-container ${isSidebarOpen ? "active" : ""}`}>
        <div className="sidebar">
          {/* Sección de Municipalidades */}
          <div className="sidebar-section">
            <h3
              id="btnMunicipalidades"
              className={`section-title ${openSections.Municipalidades ? "active" : ""}`}
              onClick={() => toggleSection("Municipalidades")}
            >
              Municipalidades <FontAwesomeIcon icon={faChevronDown} />
            </h3>
            <ul className={`menu-list ${openSections.Municipalidades ? "show" : ""}`}>
            {municipalidades.map((mun: string, index: number) => (
              <li key={index}>
                <button
                  type="button"
                  className={`menu-item ${selectedMunicipality === mun ? "selected" : ""}`}
                  disabled={selectedMunicipality === mun}
                  onClick={(e) => handleMunicipalitySelect(mun, e)}
                >
                  {mun}
                </button>
              </li>
            ))}
            </ul>
          </div>

          {/* Sección Estado de Cuenta */}
          <div className="sidebar-section">
            <h3
              className={`section-title ${openSections.EstadoCuenta ? "active" : ""}`}
              onClick={() => toggleSection("EstadoCuenta")}
            >
              Estado de Cuenta <FontAwesomeIcon icon={faChevronDown} />
            </h3>
            <ul className={`menu-list ${openSections.EstadoCuenta ? "show" : ""}`}>
              <li>
                <Link to="/bienes-inmuebles" {...restrictedLinkProps}>
                  <FontAwesomeIcon icon={faHome} className="menu-icon" />
                  Bienes Inmuebles
                </Link>
              </li>
              <li>
                <Link to="/impuesto-personal" {...restrictedLinkProps}>
                  <FontAwesomeIcon icon={faUser} className="menu-icon" />
                  Impuesto Vecinal
                </Link>
              </li>
              <li>
                <Link to="/servicios-publicos" {...restrictedLinkProps}>
                  <FontAwesomeIcon icon={faBuilding} className="menu-icon" />
                  Servicios Públicos
                </Link>
              </li>
              <li>
                <Link to="/industria-comercio" {...restrictedLinkProps}>
                  <FontAwesomeIcon icon={faIndustry} className="menu-icon" />
                  Impuesto Negocios
                </Link>
              </li>
              <li>
                <Link to="/otras-tasas" {...restrictedLinkProps}>
                  <FontAwesomeIcon icon={faTrash} className="menu-icon" />
                  Multas Municipales
                </Link>
              </li>
              <li>
                <Link to="/otras-tasas" {...restrictedLinkProps}>
                  <FontAwesomeIcon icon={faTrash} className="menu-icon" />
                  Servicios Varios
                </Link>
              </li>
            </ul>
          </div>

          {/* Sección Servicios Tributarios */}
          <div className="sidebar-section">
            <h3 className="section-title" onClick={() => toggleSection("Declaraciones")}>
              Servicios Tributarios <FontAwesomeIcon icon={faChevronDown} />
            </h3>
            <ul className={`menu-list ${openSections.Declaraciones ? "show" : ""}`}>
              <li>
                <Link to="/volumen-ventas" {...restrictedLinkProps}>
                  <FontAwesomeIcon icon={faFileAlt} className="menu-icon" />
                  Solvencia Vecinal
                </Link>
              </li>
              <li>
                <Link to="/renovaciones" {...restrictedLinkProps}>
                  <FontAwesomeIcon icon={faRepeat} className="menu-icon" />
                  Permiso operación negocios
                </Link>
              </li>
              <li>
                <Link to="/renovaciones" {...restrictedLinkProps}>
                  <FontAwesomeIcon icon={faRepeat} className="menu-icon" />
                  Impuesto volumen ventas
                </Link>
              </li>
              <li>
                <Link to="/renovaciones" {...restrictedLinkProps}>
                  <FontAwesomeIcon icon={faRepeat} className="menu-icon" />
                  Cambio de propietario
                </Link>
              </li>
              <li>
                <Link to="/renovaciones" {...restrictedLinkProps}>
                  <FontAwesomeIcon icon={faRepeat} className="menu-icon" />
                  Cambio de giro negocio
                </Link>
              </li>
              <li>
                <Link to="/renovaciones" {...restrictedLinkProps}>
                  <FontAwesomeIcon icon={faRepeat} className="menu-icon" />
                  Cambio de negocio
                </Link>
              </li>
              <li>
                <Link to="/renovaciones" {...restrictedLinkProps}>
                  <FontAwesomeIcon icon={faRepeat} className="menu-icon" />
                  Planes de Pago
                </Link>
              </li>
            </ul>
          </div>

          {/* Sección Servicios Catastrales */}
          <div className="sidebar-section">
            <h3 className="section-title" onClick={() => toggleSection("Servicios")}>
              Servicios Catastrales <FontAwesomeIcon icon={faChevronDown} />
            </h3>
            <ul className={`menu-list ${openSections.Servicios ? "show" : ""}`}>
              <li>
                <Link to="/solicitud-inspeccion" {...restrictedLinkProps}>
                  <FontAwesomeIcon icon={faSearch} className="menu-icon" />
                  Solicitud de Permiso de Construccion
                </Link>
              </li>
              <li>
                <Link to="/ambientales" {...restrictedLinkProps}>
                  <FontAwesomeIcon icon={faLeaf} className="menu-icon" />
                  Constancias Catastrales
                </Link>
              </li>
              <li>
                <Link to="/ambientales" {...restrictedLinkProps}>
                  <FontAwesomeIcon icon={faLeaf} className="menu-icon" />
                  Solicitud de Inspecciones
                </Link>
              </li>
              <li>
                <Link to="/ambientales" {...restrictedLinkProps}>
                  <FontAwesomeIcon icon={faLeaf} className="menu-icon"/>
                  Planos Catastrales
                </Link>
              </li>
            </ul>
          </div>

          {/* Sección Servicios Ambientales */}
          <div className="sidebar-section">
            <h3 className="section-title" onClick={() => toggleSection("Ambientales")}>
              Servicios Ambientales <FontAwesomeIcon icon={faChevronDown} />
            </h3>
            <ul className={`menu-list ${openSections.Ambientales ? "show" : ""}`}>
              <li>
                <Link to="/solicitud-inspeccion" {...restrictedLinkProps}>
                  <FontAwesomeIcon icon={faSearch} className="menu-icon" />
                  Inspecciones Ambientales
                </Link>
              </li>
              <li>
                <Link to="/ambientales" {...restrictedLinkProps}>
                  <FontAwesomeIcon icon={faLeaf} className="menu-icon" />
                  Constancias Ambientales
                </Link>
              </li>
              <li>
                <Link to="/ambientales" {...restrictedLinkProps}>
                  <FontAwesomeIcon icon={faLeaf} className="menu-icon" />
                  Permisos Ambientales
                </Link>
              </li>
            </ul>
          </div>

          {/* Sección Servicios Públicos */}
          <div className="sidebar-section">
            <h3 className="section-title" onClick={() => toggleSection("Publicos")}>
              Servicios Públicos <FontAwesomeIcon icon={faChevronDown} />
            </h3>
            <ul className={`menu-list ${openSections.Publicos ? "show" : ""}`}>
              <li>
                <Link to="/solicitud-inspeccion" {...restrictedLinkProps}>
                  <FontAwesomeIcon icon={faSearch} className="menu-icon" />
                  Cambio de Propietario
                </Link>
              </li>
              <li>
                <Link to="/ambientales" {...restrictedLinkProps}>
                  <FontAwesomeIcon icon={faLeaf} className="menu-icon" />
                  Cambio de Domicilio
                </Link>
              </li>
              <li>
                <Link to="/ambientales" {...restrictedLinkProps}>
                  <FontAwesomeIcon icon={faLeaf} className="menu-icon" />
                  Libro de Quejas
                </Link>
              </li>
              <li>
                <Link to="/ambientales" {...restrictedLinkProps}>
                  <FontAwesomeIcon icon={faLeaf} className="menu-icon" />
                  Planes de Pago
                </Link>
              </li>
              <li>
                <Link to="/ambientales" {...restrictedLinkProps}>
                  <FontAwesomeIcon icon={faLeaf} className="menu-icon" />
                  Solicitud de Servicio
                </Link>
              </li>
            </ul>
          </div>

          {/* Sección Servicios Varios */}
          <div className="sidebar-section">
            <h3 className="section-title" onClick={() => toggleSection("Varios")}>
              Servicios Varios <FontAwesomeIcon icon={faChevronDown} />
            </h3>
            <ul className={`menu-list ${openSections.Varios ? "show" : ""}`}>
              <li>
                <Link to="/solicitud-inspeccion" {...restrictedLinkProps}>
                  <FontAwesomeIcon icon={faSearch} className="menu-icon" />
                  Constancias Municipales
                </Link>
              </li>
              <li>
                <Link to="/ambientales" {...restrictedLinkProps}>
                  <FontAwesomeIcon icon={faLeaf} className="menu-icon" />
                  Certificaciones
                </Link>
              </li>
              <li>
                <Link to="/ambientales" {...restrictedLinkProps}>
                  <FontAwesomeIcon icon={faLeaf} className="menu-icon" />
                  Licencias
                </Link>
              </li>
              <li>
                <Link to="/ambientales" {...restrictedLinkProps}>
                  <FontAwesomeIcon icon={faLeaf} className="menu-icon" />
                  Permisos de Explotación
                </Link>
              </li>
              <li>
                <Link to="/ambientales" {...restrictedLinkProps}>
                  <FontAwesomeIcon icon={faLeaf} className="menu-icon" />
                  Vistos Buenos
                </Link>
              </li>
              <li>
                <Link to="/ambientales" {...restrictedLinkProps}>
                  <FontAwesomeIcon icon={faLeaf} className="menu-icon" />
                  Cartas de Ventas
                </Link>
              </li>
              <li>
                <Link to="/ambientales" {...restrictedLinkProps}>
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
