import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../style/prueba.css"; // Archivo de estilo para los componentes
import "../../style/metodo.css"; // Archivo de estilo para los componentes
import Municipalidad from "../Images/Municipalidad";

const ServiciosPublicos: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(
    "Proceso confirmacion sobre su facturacion de servicios publicos"
  );

  //Funcion para abrir la modal
  const handleOpenModal = () => {
    setModalOpen(true);
    setLoading(true); // Inicia el estado de carga
    setLoading(true); // Reinicia el estado de carga al abrir el modal
    setMessage(
      "Procesando confirmación sobre su facturación de servicios publicos."
    ); // Mensaje inicial
    // Simula un tiempo de carga (por ejemplo, 3 segundos)
    setTimeout(() => {
      setLoading(false);
      setMessage("Puede proceder con su proceso de facturación."); // Cambia el mensaje al finalizar la carga
    }, 3000);
  };

  // Funcion para cerrar el modal
  const handleCloseModal = () => {
    setModalOpen(false);
  };
  //Simucion de un tiempo de carga (en un estado de 3 segundos)

  return (
    <div className="detalles-impuesto-container">
      <h2 className="title">PROCESO DE FACTURACION DE SERVICIOS PUBLICOS</h2>
      <Municipalidad />

      <table className="details-table">
        <thead>
          <tr>
            <th>Clave Catastral</th>
            <th>Contribuyente</th>
            <th>Residencia</th>
            <th style={{ cursor: "pointer" }}>Facturas</th>
          </tr>
        </thead>
        <tbody>
          {/* Añade más filas si es necesario */}
          <tr style={{ textAlign: "center" }}>
            <td style={{ textAlign: "center" }}>082303REZARA000298</td>
            <td style={{ textAlign: "center" }}>
              Jonathan Ignacio Marley Ramirez
            </td>
            <td style={{ textAlign: "center" }}>COL. VILLEDA MORALES</td>
            <td
              style={{
                cursor: "pointer",
                color: "orange",
                textAlign: "center",
              }}
              onClick={handleOpenModal}
            >
              Facturas
            </td>{" "}
            {/* Hace clic aquí para abrir el modal */}
          </tr>
          {/* Añade más filas si es necesario */}
          <tr style={{ textAlign: "center" }}>
            <td style={{ textAlign: "center" }}>082303REZARA000298</td>
            <td style={{ textAlign: "center" }}>
              Jonathan Ignacio Marley Ramirez
            </td>
            <td style={{ textAlign: "center" }}>COL. VILLEDA MORALES</td>
            <td
              style={{
                cursor: "pointer",
                color: "orange",
                textAlign: "center",
              }}
              onClick={handleOpenModal}
            >
              Facturas
            </td>{" "}
            {/* Hace clic aquí para abrir el modal */}
          </tr>
          {/* Añade más filas si es necesario */}
          <tr style={{ textAlign: "center" }}>
            <td style={{ textAlign: "center" }}>082303REZARA000298</td>
            <td style={{ textAlign: "center" }}>
              Jonathan Ignacio Marley Ramirez
            </td>
            <td style={{ textAlign: "center" }}>COL. VILLEDA MORALES</td>
            <td
              style={{
                cursor: "pointer",
                color: "orange",
                textAlign: "center",
              }}
              onClick={handleOpenModal}
            >
              Facturas
            </td>{" "}
            {/* Hace clic aquí para abrir el modal */}
          </tr>
        </tbody>
      </table>

      {/*Modal*/}
      {isModalOpen && (
        <div className="modal">
          <div className="modalDetalleFactura" >
            <h3>Detalles de Facturación</h3>
            <button className="close-button" onClick={handleCloseModal}>
              Cerrar
            </button>
            <Municipalidad />
            <p>{message}</p> {/* Muestra el mensaje dinámico aquí */}
            {loading ? (
              <div className="loader"></div> // Muestra el círculo de carga mientras "loading" es true
            ) : (
              <Link to="/Proceso-FacturacionSV" className="button-link">
                Continuar
              </Link>
            )}
          </div>
        </div>
        // <ModalDetFacturacion />
      )}
    </div>
  );
};

export default ServiciosPublicos;
