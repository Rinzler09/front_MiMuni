import React, { useState, useEffect } from "react";// Importaciones de useState, UseEffect es para poder validar todo
import { Link, useNavigate } from "react-router-dom";// en esta parte estamos importando el useNavigate para la rutas de react-route-dom
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";// Importacion de los iconos de la libreria react-fontawesome
import {
  faUniversity,
  faFileInvoice,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";// Importaciones de iconos de la libreria free.solid.svg.icons
import "../../style/LayoutStyles/sidebar.css";// Importacion de estilo de sidebar.css
import { useAuth } from "../../Auth/AuthContext";// Importacion de useAuth de AuthContext.tsx
import { Toaster, toast } from "sonner";// Importacion de Toast de la libreria sonner // Codigo descartado
import { mensajes } from "../../util/message"//Importacion de mensajes de errores de util/message
import { MdErrorOutline } from "react-icons/md";// Importacion de MDErrorOutline, esto nos ayuda mostrar graficamente un simbolo de error en la interface donde lo estamos utilizando

// // PROPS para controlar el collapse del sidebar
export interface SidebarPROPS { //marley lo programo y no supo explicar
  collapsed: boolean;
}


const Sidebar: React.FC<SidebarPROPS> = ({ collapsed }) => {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({// Declaramos una contanste en donde contiene openSections, SetOpenSections,
    //donde tambien estamos pasando un generico key:string: booleano, donde nos indica que el estado sera un objeto cuyas claves son string y los valores son booleans
    EstadoCuenta: false,//Aqui tenemos una un objeto donde es false significa que esta cerrada el desplegable
    Declaraciones: false,//Aqui tenemos una un objeto donde es false significa que esta cerrada el desplegable
    Servicios: false,//Aqui tenemos una un objeto donde es false significa que esta cerrada el desplegable
    Ambientales: false,//Aqui tenemos una un objeto donde es false significa que esta cerrada el desplegable
    Municipalidades: true,//Aqui tenemos una un objeto donde es false significa que esta cerrada el desplegable
    Publicos: false,//Aqui tenemos una un objeto donde es false significa que esta cerrada el desplegable
    Varios: false,//Aqui tenemos una un objeto donde es false significa que esta cerrada el desplegable
  });
  const { user, selectedMunicipality, setSelectedMunicipality } = useAuth();/**Tenemos el user  que es un objeto con el dato del usuario que se esta logueando tiene toda su informacion
  SelectedMunicipality: es donde la municipalidad donde el usuario haya seleccionado
  SetSelectedMunicipality: es donde se releja la actualizacion del objeto al momento de cambiar la municipalidad */
  //const token = sessionStorage.getItem("access_TKN");
  const navigate = useNavigate();// En esta parte tenemos una constante en donde tenemos el navigate declarado y dentro de eso tenemos el hook de useNavigate() en donde lo utilizamos para poder navegar

  const sbMenEstCuenta: string[] = ['Bienes Inmuebles', 'Impuesto Vecinal', 'Servicios Publicos', 'Impuesto Negocios', 'Multas Municipales', 'Servicios Varios'];//Cadenas de Titulos para subMenu correspondiente 
  // const sbMenEstCuenta_I: any[] = [faHome, faUser, faBuilding, faIndustry, faBuilding, faBuilding]; //Iconos para subMenu correspondiente
  const sbMenEstCuenta_R: string[] = ['/bienes-inmuebles', '/impuesto-personal', '/servicios-publicos', '/industria-comercio', '/otras-tasas', '/otras-tasas'];//Cadenas de Rutas para subMenu correspondiente 
  const [selectedSubMenuIdx, setSelectedSubMenuIdx] = useState<number | null>(null);


  const toggleSection = (section: string) => {/**En este apartado tenemos una funcion donde funciona para poder abrir y cerrar dinamicamente una seccion con el estado de
                                              openSections, en este caso tenemos section que recibe la seccion que quiere togglear, ya sea servicios, Declaraciones etc*/
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));/**tenes el setOpenSections que es donde se estara actualizando el estado que reciba
    Tambien tenemos el ...prev, donde copia la propiedades existente de openSections ya que cada seccion con su valor es true o false*/
  };


  const gotoMenu = () => navigate("/dashboard");//Tenemos la funcion que es redirigir al usuario a la ruta de dashboard usando el hook navigate.  

  const municipalidades = user?.municipalidades || [];//Declaramos una constante con el nombre de municiaplidades.
  // En este caso obtiene la lista de la municipalidades la cual el usuario tiene acceso, mediante de user.?municipalidades  

  // Selección de municipalidad con toast
  const handleMunicipalitySelect = ( //Tenemos una funcion en donde se maneja un evento que se ejecuta cuando el usuario hace click en un boton para selecionar un municipio
    municipality: string, e: React.MouseEvent<HTMLButtonElement>) => {// En esta parte de municipality, nombre del municipio que se esta seleccioando
    //El React.MouseEvent<HTMLButtonElement> Es el evento de clic sobre boton que se esta seleccionando
    e.preventDefault();//En este apartado tenemos que si el boton que no se vuelva a seleccionar si el usuario selecciona otra vez
    e.stopPropagation();//hace que no se duplique el evento al momento de seleccionarlo en este caso como los tast
    setSelectedMunicipality(municipality);//En este el setSelectedMunicipality(municipality) acualiza el estado de la municipalidad.
    toast.success(`${municipality} seleccionada.`);// Muestra el mensaje de exito al momento de seleccionar una municpalidad.
  };

  const handleRestrictedClick = (e: React.MouseEvent) => {//Esta funcion sirve para el bloqueo de todas las secciones, si al momento no se le selecciono una municipalidad
    if (!selectedMunicipality) {//Esto comprueba si la variable selectedMunicipality no esta seleccionada, quiere decir que no esta seleccionada una muniipalidad
      e.preventDefault();// Realiza que no se pueda selecionar ninguna seccion al momento de no tenenr una municipalidad seleccionada
    }
  };

  const restrictedLinkProps = !selectedMunicipality/**En este caso restrictedLinkProps sera un objeto con propiedades*/
    ? { onClick: handleRestrictedClick, className: "menu-item disabled" }//Asigna un manejador que ejecuta e.preventDefault() si el usuario intenta hacer clic sin haber elegido municipio, bloqueando la acción (por ejemplo, evitar la navegación).
    : { className: "menu-item" }; //Esto es para que menu-item, sin handler extra ni estilo de “deshabilitado” el enlace o botón funciona como normal.

  // Codigo por analizar.
  let contadorNota = 0;//contador para mostrar una sola vez la alerta de Tomar Nota
  useEffect(() => {//Solo procede si el usuario está logueado y aún NO ha seleccionado municipalidad
    contadorNota += 1;
    if (contadorNota <= 1) {
      setTimeout(() => {
        toast.info(<span style={{ color: "blue", fontSize: "1.1em" }}>{mensajes["!Tomar Nota!"]?.mensaje || "!Tomar Nota!"} </span>, { // Mensaje que se le muestra en la parte de entrada
          description: (<span>Por favor, selecciona una municipalidad para comenzar.</span>),//Descripcion del mensaje que se le muestra al usuario (Contrituyete)
          icon: <MdErrorOutline style={{ color: "blue", fontSize: "1.2em" }} />//Icono de informacion para que el usuario (Contribuyente) pueda saber que el mensaje es importante
        }
        );
        //toast.info( "Por favor, seleccione una municipalidad para continuar con el proceso de pago.");
      }, 3000);// Retraso de 3000 ms para no interrumpir inmediatamente la experiencia de carga  
    }

  }, []);//Este hook hace que cambie en selectedMunicipality

  return (


    <div>
      {/**En esta parte se agrego el cambio de la posicion superior y el tipo del color de los toast que viene de la libreria toast*/}
      <Toaster closeButton position="top-right" richColors />

      {/* Contenedor del sidebar */}
      <div className={`sidebar-container ${collapsed ? 'collapsed' : ''}`}>
        {/* <div className={`sidebar-container ${isOpen ? "open" : ""}`}> */}
        {/* ——— Brand / Logo arriba ——— */}
        <div className="sidebar-brand">
          <img
            src="../../public/img/Muni.png" alt="Mi Muni En Línea" className="sidebar-logo" />
          {/* sólo mostrar texto cuando NO esté colapsado */}
          {/* {!isOpen && (
            <span className="sidebar-brand-text" onClick={gotoMenu}>Mi Muni En Línea</span>
          )} */}
          {(
            <span className="sidebar-brand-text" onClick={gotoMenu}>Mi Muni En Línea</span>
          )}
        </div>
        {/* Sección de Municipalidades */}
        <div className="sidebar-section">
          <h3 id="btnMunicipalidades" className={`section-title ${openSections.Municipalidades ? "active" : ""}`} onClick={() => toggleSection("Municipalidades")}>
            <span className="section-text"><FontAwesomeIcon className="subMenuIcon" icon={faUniversity} />Municipalidades</span>
            <span className="section-icon"><FontAwesomeIcon icon={faUniversity} /></span>
            <FontAwesomeIcon className="section-chev" icon={faChevronDown} />
          </h3>
          
        
          <ul className={`menu-list ${openSections.Municipalidades ? "show" : ""}`}>
            {municipalidades.map((mun: string, index: number) => (
              <li key={index}>
                <button type="button" className={`menu-item ${selectedMunicipality === mun ? "selected" : ""}`} disabled={selectedMunicipality === mun} onClick={(e) => handleMunicipalitySelect(mun, e)}>
                  {mun}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Sección Estado de Cuenta */}
        <div className="sidebar-section">
          <h3 className={`section-title ${openSections.EstadoCuenta ? "active" : ""}`} onClick={() => toggleSection("EstadoCuenta")}>
            <span className="section-text"><FontAwesomeIcon className="subMenuIcon" icon={faFileInvoice} />Estado de Cuenta </span>
            <span className="section-icon"><FontAwesomeIcon icon={faFileInvoice} /></span>
            <FontAwesomeIcon className="section-chev" icon={faChevronDown} />
          </h3>
          <ul className={`menu-list ${openSections.EstadoCuenta ? "show" : ""}`}> {/*show sirve para mostrar el despliegue del dropdown*/}
            {sbMenEstCuenta.map((item, index) => (
              <li key={index}>
                <Link to={sbMenEstCuenta_R[index]}
                  {...restrictedLinkProps} //restrictedProps ya usa clase menu-item 
                  className={` ${restrictedLinkProps.className === "menu-item disabled" ? restrictedLinkProps.className : "menu-item"}
                   ${selectedSubMenuIdx === index ? "selected" : ""} `}
                  onClick={() => {
                    console.log("El valor de selectedSubMenuIdx: ", selectedSubMenuIdx);
                    console.log("el className de restrictedprops: ", restrictedLinkProps.className);
                    setSelectedSubMenuIdx(index); //se guarda el numero de indice para cada subMenu de la lista el cual debe hacer match con el indice actual que se clickea
                  }}
                >
                  {/* <FontAwesomeIcon icon={sbMenEstCuenta_I[index]} className="menu-icon" /> */}
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* <div className="sidebar-section">
          <h3 className="section-title" onClick={() => toggleSection("Declaraciones")}>
             <span className="section-text">Servicios Tributarios</span>
           <span className="section-icon"> <FontAwesomeIcon icon={faFileAlt} /></span>
           <FontAwesomeIcon className="section-chev" icon={faChevronDown} />
          </h3>
          
          <ul className={`menu-list ${openSections.Declaraciones ? "show" : ""}`}>
            <li>
              <Link to="/volumen-ventas" {...restrictedLinkProps}>
                Solvencia Vecinal
              </Link>
            </li>
            <li>
              <Link to="/renovaciones" {...restrictedLinkProps}>
                Permiso operación negocios
              </Link>
            </li>
            <li>
              <Link to="/renovaciones" {...restrictedLinkProps}>
                Impuesto volumen ventas
              </Link>
            </li>
            <li>
              <Link to="/renovaciones" {...restrictedLinkProps}>
                Cambio de propietario
              </Link>
            </li>
            <li>
              <Link to="/renovaciones" {...restrictedLinkProps}>
                Cambio de giro negocio
              </Link>
            </li>
            <li>
              <Link to="/renovaciones" {...restrictedLinkProps}>
                Cambio de negocio
              </Link>
            </li>
            <li>
              <Link to="/renovaciones" {...restrictedLinkProps}>
                Planes de Pago
              </Link>
            </li>
          </ul>
        </div> */}

        {/* Sección Servicios Catastrales
        <div className="sidebar-section">
          <h3 className="section-title" onClick={() => toggleSection("Servicios")}>
            <span className="section-text">  Servicios Catastrales</span>
           <span className="section-icon"> <FontAwesomeIcon icon={faFileAlt} /></span>
           <FontAwesomeIcon className="section-chev" icon={faChevronDown} />
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
                <FontAwesomeIcon icon={faLeaf} className="menu-icon" />
                Planos Catastrales
              </Link>
            </li>
          </ul>
        </div> */}

        {/* Sección Servicios Ambientales
        <div className="sidebar-section">
          <h3 className="section-title" onClick={() => toggleSection("Ambientales")}>
            <span className="section-text">Servicios Ambientales</span>
           <span className="section-icon"> <FontAwesomeIcon icon={faFileAlt} /></span>
           <FontAwesomeIcon className="section-chev" icon={faChevronDown} />
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
        </div> */}

        {/* Sección Servicios Públicos
        <div className="sidebar-section">
          <h3 className="section-title" onClick={() => toggleSection("Publicos")}>
            <span className="section-text">Servicios Públicos</span>
           <span className="section-icon"> <FontAwesomeIcon icon={faFileAlt} /></span>
           <FontAwesomeIcon className="section-chev" icon={faChevronDown} />
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
        </div> */}

        {/* Sección Servicios Varios
        <div className="sidebar-section">
          <h3 className="section-title" onClick={() => toggleSection("Varios")}>
            <span className="section-text">Servicios Varios</span>
           <span className="section-icon"> <FontAwesomeIcon icon={faFileAlt} /></span>
           <FontAwesomeIcon className="section-chev" icon={faChevronDown} />
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
        </div> */}
      </div>
    </div >

  );
};

export default Sidebar;