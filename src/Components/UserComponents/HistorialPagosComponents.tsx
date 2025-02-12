import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../style/prueba.css"; // Archivo de estilo para los componentes
import "../../style/style.css"; //dededededed
import "../../style/tazas.css"; //dededededed
import "../../style/historialFacturas.css";
import Municipalidad from "../Images/Municipalidad";

/* Se define la interface facturas con su tipo de dato */

interface Facturas {
  id: number;
  descripcion: string;
  tipopago: string;
  subtotal: number;
  valortotal: number;
  fechapago: string;
  periodo: number;
  estado: string;
}


const HistorialPagos: React.FC = () => {
  {
    /*Selecion de facturacion en el estado de metodo de busqueda */
  }

  /*Se use el hook de useState para el arreglo de Facturas*/
  const [factura, setFactura] = useState<Facturas[]>([]);

  /*Se usa el hook de useEffect para cargar las facturas cada vez que haya un cambio en el arreglo*/
  useEffect(() => {
    const fetchFacturas = async () => {
      try {
        const respuesta = await fetch('https://apex.oracle.com/pls/apex/mapea_hn/apiFacturas/getFacturas/');
        const data = await respuesta.json();

        if (data && Array.isArray(data.items)) {
          setFactura(data.items);

        } else {
          console.error('La respuesta de la API no contiene un arreglo: ', data)
        }
      } catch (error) {
        console.error('Error obtienendo registros: ', error);
      }
    };

    fetchFacturas();
  }, [factura]);

  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 5;

  //se calculan los indices para las paginas actuales
  const indUltimoReg = paginaActual * registrosPorPagina;
  const indPrimerReg = indUltimoReg - registrosPorPagina;
  const registrosActuales = factura.slice(indPrimerReg, indUltimoReg);

  // Manejador de paginacion
  const pagsTotales = Math.ceil(factura.length / registrosPorPagina);
  const handleCambioPag = (numPag: number) => {
    setPaginaActual(numPag);
  }

  /* REALIZADO POR MARLEY */
  const [showTable, setShowTable] = useState(false);
  const [selectedOption, setSelectedOption] = useState(""); // Track selected dropdown option
  const [showSelectionModal, setShowSelectionModal] = useState(false); // Track selection modal visibility
  {
    /*Proceso de facturacion en PDF la patalla modal */
  }
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showConfirmationIcon, setShowConfirmationIcon] = useState(false);
  const [showOkButton, setShowOkButton] = useState(false);
  const [confirmationMessage, setConfirmationMessage] =
    useState("Procesando...");

  const handlePayButtonClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setShowConfirmationModal(true);
    setShowConfirmationIcon(false);
    setShowOkButton(false);
    setConfirmationMessage("Procesando la factura...");

    setTimeout(() => {
      setShowConfirmationIcon(true);
      setConfirmationMessage("Factura documentada en PDF");
      setShowOkButton(true);
    }, 3000);
  };

  {
    /*Proceso de ventana modal*/
  }
  const handleRefreshClick = () => {
    if (!selectedOption || selectedOption === "Tipo de factura") {
      // Show modal if no option is selected
      setShowSelectionModal(true);
    } else {
      setShowTable(true); // Display the table if an option is selected
    }
  };

  {
    /*Proceso de validacion de fechas` */
  }
  const fechasRefreshClick = () => {
    if (!startDate || !endDate) {
      // Show modal if dates are not selected
      setShowSelectionModal(true);
    } else {
      setShowTable(true); // Display the table if both dates are selected
    }
  };

  {
    /*Proceso de ventana modal de validacion desde */
  }

  const handleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value); // Update selected option
  };

  const closeSelectionModal = () => {
    setShowSelectionModal(false); // Close selection modal
  };

  return (
    <div className="historialFacturas">
      <h2 className="title">Historial de facturación</h2>
      <div className="logoMuni">
        <Municipalidad />
      </div>
      {/* Date Range Filter */}
      <div className="historial-facturacion-container">
        <h2
          className="tituloprincipal"
          style={{
            color: "#bdbdbd",
            fontSize: "17px",
            fontWeight: "normal",
            width: "",
            margin: 12,
            padding: 14,
          }}
        >
          Historial de facturación
        </h2>
        <div className="date-range-container">
          <div className="date-range-filter">
            <select className="date-input" onChange={handleOptionChange}>
              <option style={{ background: "#FFFFFF", color: "black" }}>
                Tipo de factura
              </option>
              <option style={{ background: "#FFFFFF", color: "black" }}>
                BI-Bienes Inmuebles
              </option>
              <option style={{ background: "#FFFFFF", color: "black" }}>
                IP-Impuesto Personal(Vecinal)
              </option>
              <option style={{ background: "#FFFFFF", color: "black" }}>
                SP-Servicios Publicos
              </option>
              <option style={{ background: "#FFFFFF", color: "black" }}>
                ICS-Industria, Comercio y Servicios
              </option>
              <option style={{ background: "#FFFFFF", color: "black" }}>
                Otras Tasas Municipales
              </option>
              <option style={{ background: "#FFFFFF", color: "black" }}>
                Declaracion Volumen de Ventas
              </option>
              <option style={{ background: "#FFFFFF", color: "black" }}>
                Solicitud de Inspeccion
              </option>
              <option style={{ background: "#FFFFFF", color: "black" }}>
                Ambientales
              </option>
            </select>
            <input
              type="date"
              defaultValue="yyy-mm-dd"
              className="date-input"
            />
            <span className="date-range-arrow">→</span>
            <input
              type="date"
              defaultValue="yyy-mm-dd"
              className="date-input"
            />
            <button
              className="icon-button refresh"
              aria-label="Refresh"
              title="Buscar Facturas"
              onClick={handleRefreshClick}
            >
              🔄
            </button>
            <button
              className="icon-button export-button"
              aria-label="Export"
              title="Descargar PDF"
              onClick={handlePayButtonClick}
            >
              📄
            </button>
          </div>
        </div>
      </div>

      {/* Tabla de Facturas - Realizado por Milton Paz*/}
      <h2 className="titlesss" style={{ background: "#FF6600" }}>
        Historial de Facturas
      </h2>
      <table className="details-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>DESCRIPCION</th>
            <th>TIPOPAGO</th>
            <th>SUBTOTAL</th>
            <th>VALORTOTAL</th>
            <th>FECHAPAGO</th>
            <th>PERIODO</th>
            <th>ESTADO</th>

          </tr>
        </thead>
        <tbody>
          {registrosActuales.map((registro, indice) => (
            <tr key={indice}>

              <td>{registro.id}</td>
              <td>{registro.descripcion}</td>
              <td>{registro.tipopago}</td>
              <td>{registro.subtotal}</td>
              <td>{registro.valortotal}</td>
              <td>{new Date(registro.fechapago).toLocaleDateString()}</td>
              <td>{registro.periodo}</td>
              <td>{registro.estado}</td>

            </tr>

          ))}
        </tbody>
      </table>
      <br />
      <nav>
        <ul className="pagination">
          {[...Array(pagsTotales).keys()].map((page) => (
            <li
              key={page}
              className={`page-item ${paginaActual === page + 1 ? 'active' : ''}`}
              onClick={() => handleCambioPag(page + 1)}
            >
              <a className="page-link" href="#!">
                {page + 1}
              </a>
            </li>
          ))

          }
        </ul>
      </nav>

      <br /><br />

      {/* Billing History Table
      <div className="historial-facturacion-containers">
        {showTable ? (
          <div className="billing-history-table">
            <table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Factura #</th>
                  <th>Concepto</th>
                  <th>Moneda Recibida</th>
                  <th>Valor en HNL</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>2 oct 2024, 1:46 p.m.</td>
                  <td style={{ color: "#FF6600" }}>008-001-01-00156431</td>
                  <td>Bienes Inmuebles</td>
                  <td>L</td>
                  <td>12,703.52</td>
                </tr>
                <tr>
                  <td>2 oct 2024, 2:22 p.m.</td>
                  <td style={{ color: "#FF6600" }}>008-001-01-00156431</td>
                  <td>Bienes Inmuebles</td>
                  <td>L</td>
                  <td>3,703.52</td>
                </tr>
                <tr>
                  <td>2 oct 2024, 3:59 p.m.</td>
                  <td style={{ color: "#FF6600" }}>008-001-01-00156431</td>
                  <td>Bienes Inmuebles</td>
                  <td>L</td>
                  <td>7,703.52</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-invoices">
            <img
              src="img/facturasPendientes.png"
              alt="No Invoices"
              className="no-invoices-image"
            />
            <p>No se encontraron facturas en el rango de fechas solicitado.</p>
          </div>
        )}
      </div> */}
      {/* Selection Required Modal */}
      {showSelectionModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <img src="img/error.svg" alt="Advertencia" className="modal-icon" />
            <h3 className="modal-title" style={{ textAlign: "center" }}>
              Mensaje de advertencia!
            </h3>
            <p className="modal-message">
              Ups!, Tienes que seleccionar unas de las opciones para poder
              facturar el documento a PDF.
            </p>
            <button className="modal-button" onClick={closeSelectionModal}>
              OK
            </button>
          </div>
        </div>
      )}
      {/* Ventana Modal de fecha Inicial y fecha Final */}
      {showSelectionModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <img src="img/error.svg" alt="Advertencia" className="modal-icon" />
            <h3 className="modal-title" style={{ textAlign: "center" }}>
              Mensaje de advertencia!
            </h3>
            <p className="modal-message">
              Ups!, Debes seleccionar una fecha inicial y final antes de
              continuar.
            </p>
            <button className="modal-button" onClick={closeSelectionModal}>
              OK
            </button>
          </div>
        </div>
      )}
      {/* Modal de confirmación */}
      {showConfirmationModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            {showConfirmationIcon ? (
              <img
                src="img/procesado.svg"
                alt="Confirmación"
                className="modal-icon"
              />
            ) : (
              <div className="loading-circle"></div>
            )}
            <h3 className="modal-title" style={{ textAlign: "center" }}>
              Procesando la factura en PDF
            </h3>
            <p className="modal-message">{confirmationMessage}</p>
            {showOkButton && (
              <Link to="/" className="modal-button">
                OK
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HistorialPagos;
