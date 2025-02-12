import { useState } from "react";
import React from "react";
import Municipalidad from "../Images/Municipalidad";
import { Link } from "react-router-dom"; // Importa Link
import "../../style/prueba.css"; //las modales estan en pruebas

const ModalDetFacturacion: React.FC = () => {
    const [isModalOpen, setModalOpen] = useState(true);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(
        "Procesando confirmación sobre su facturación."
    );

    setLoading(true); // Inicia el estado de carga
    setLoading(true); // Reinicia el estado de carga al abrir el modal
    setMessage("Procesando confirmación sobre su facturación."); // Mensaje inicial
    // Simula un tiempo de carga (por ejemplo, 3 segundos)
    setTimeout(() => {
        setLoading(false);
        setMessage("Puede proceder con su facturación."); // Cambia el mensaje al finalizar la carga
    }, 3000);

    // const handleOpenModal = () => {
    //     setLoading(true); // Inicia el estado de carga
    //     // setLoading(true); // Reinicia el estado de carga al abrir el modal
    //     // setMessage("Procesando confirmación sobre su facturación."); // Mensaje inicial
    //     // // Simula un tiempo de carga (por ejemplo, 3 segundos)
    //     setTimeout(() => {
    //       setLoading(false);
    //       setMessage("Puede proceder con su facturación."); // Cambia el mensaje al finalizar la carga
    //     }, 3000);
    //   };

    // Función para cerrar el modal
    const handleCloseModal = () => {
        setModalOpen(false);
    };

    return (

        <div className="modal">
            {isModalOpen && loading && message &&
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
                        <Link to="/Proceso-Facturacion" className="button-link">
                            Continuar
                        </Link>
                    )}
                </div>
            }
        </div>


    );
};

export default ModalDetFacturacion;
