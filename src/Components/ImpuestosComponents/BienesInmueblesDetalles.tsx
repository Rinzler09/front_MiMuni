import React, { useState, useEffect } from "react";
import { clavesCatastrales } from "../../services/claveCatastral";
import { useNavigate } from "react-router-dom";
import "../../style/ImpuestosStyles/detalleBienInmueble.css";
import Municipalidad from "../ImagesComponents/Municipalidad";




/* Se define la interface Claves con su tipo de dato */

interface Claves {
  id: number;
  nombre_contri: string;
  apellido_contri: string;
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
<<<<<<< Updated upstream
      <h2 className="title"><Municipalidad />ESTADO DE CUENTA BIENES INMUEBLES</h2>
      <br />
      <table className="details-table table-bordered">
=======
      <h2 className="title"><Municipalidad />ESTADO DE CUENTA DE BIENES INMUEBLES</h2>

      <h2 className="subTitles" >Claves Catastrales de contribuyente</h2>

      <table className="details-table">
>>>>>>> Stashed changes
        <thead>
          <tr>
            <th>Propietario</th>
            <th>Clave Catastral</th>
            <th>Valor Impuesto</th>
            <th>Aldea</th>
            <th>Barrio/Caserio</th>
            <th>Naturaleza</th>
            <th>Uso</th>
            <th>Sub Uso</th>
            <th>Ver Facturas</th>

          </tr>
        </thead>
        <tbody >
          {claves.map((clave) => (
            <tr key={clave.id}>

              <td>{`${clave.nombre_contri} ${clave.apellido_contri}`}</td>
              <td>{clave.clave_catastrales}</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
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
