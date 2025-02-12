import React, { useState, useEffect } from "react";
import { clavesCatastrales } from "../../services/claveCatastral";
import { useNavigate } from "react-router-dom"; // Importa Link
import "../../style/prueba.css"; // Archivo de estilo para los componentes
import "../../style/metodo.css";
import "../../style/detalleBienInmueble.css";
import Municipalidad from "../Images/Municipalidad";
import ModalDetFacturacion from "../VentanasModales/ModalDetFacturacion";



/* Se define la interface Claves con su tipo de dato */

interface Claves {
  id: number;
  nombre_contri: string;
  apellido_contri: string;
  dni_contri: number;
  rtn_contri: number;
  clave_catastrales: string;
}

const DetallesImpuesto: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(
    "Procesando confirmación sobre su facturación."
  );

  /*Se use el hook de useState para el arreglo de Claves catastrales*/
  const [claves, setClaves] = useState<Claves[]>([]);

  const navigate = useNavigate(); /*Hook de navigate*/

  useEffect(() => {
    const fetchClaves = async () => {
      try {
        //verificamos que usuario se esta usando
        const user = JSON.parse(localStorage.getItem('usuario') || '{}');
        console.log("Usuario para clave", user);

        //le mandamos el usuario como parametro
        const respuesta = await clavesCatastrales(user);

        if (respuesta && Array.isArray(respuesta)) {
          setClaves(respuesta);
          console.log(respuesta);
        } else {
          console.error("La respuesta de la API no contiene un arreglo:", respuesta);
        }
      } catch (error) {
        console.error("Error obteniendo registros:", error);
      }
    };

    fetchClaves();
  }, [claves]);

  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 5;

  //se calculan los indices para las paginas actuales
  const indUltimoReg = paginaActual * registrosPorPagina;
  const indPrimerReg = indUltimoReg - registrosPorPagina;
  const registrosActuales = claves.slice(indPrimerReg, indUltimoReg);

  // Manejador de paginacion
  const pagsTotales = Math.ceil(claves.length / registrosPorPagina);
  const handleCambioPag = (numPag: number) => {
    setPaginaActual(numPag);
  }



  // Función para abrir el modal
  const handleOpenModal = () => {
    setModalOpen(true);
    setLoading(true); // Inicia el estado de carga
    setLoading(true); // Reinicia el estado de carga al abrir el modal
    setMessage("Procesando confirmación sobre su facturación."); // Mensaje inicial
    // Simula un tiempo de carga (por ejemplo, 3 segundos)
    setTimeout(() => {
      setLoading(false);
      setMessage("Puede proceder con su facturación."); // Cambia el mensaje al finalizar la carga
    }, 3000);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="detalles-impuesto-container">
      <h2 className="title">Municipalidad de Santa Lucía</h2>
      <Municipalidad />
      <h2 className="titlesss" style={{ background: "#FF6600" }}>
        Claves Catastrales de contribuyente
      </h2>
      <table className="details-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>NOMBRES</th>
            <th>APELLIDOS</th>
            <th>DNI</th>
            <th>RTN</th>
            <th>CLAVES CATASTRALES</th>
            <th>Ver Facturas</th>

          </tr>
        </thead>
        <tbody>
          {claves.map((clave) => (
            <tr key={clave.id}>

              <td>{clave.id}</td>
              <td>{clave.nombre_contri}</td>
              <td>{clave.apellido_contri}</td>
              <td>{clave.dni_contri}</td>
              <td>{clave.rtn_contri}</td>
              <td>{clave.clave_catastrales}</td>
              <td><button className="btnFacturas" onClick={() => { navigate("/facturasBI") }
              }>Facturas</button></td>

            </tr>

          ))}
        </tbody>
      </table>

    </div>
  );
};

export default DetallesImpuesto;
