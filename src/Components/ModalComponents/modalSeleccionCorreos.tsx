import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import '../../style/ModalesStyles/PageModal/modalSeleccionCorreos.css';
import { registrarCorreoPrincipal } from '../../services/correoPrincipalServices';
import Modals from './modalComponent';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import { FaInfoCircle } from "react-icons/fa";

interface Props {
    showSeleccionCorreos: boolean;
    handleClose: () => void;
    correos: string[];
    descripcion?: string;
    identidad: string;
    registrotributario: string;
}

const SeleccionCorreos: React.FC<Props> = ({ showSeleccionCorreos, handleClose, correos, identidad, registrotributario }) => {

    // Mensaje que se mostrará dependiendo de la cantidad de correos
    const cantidadCorreos = correos.length; // Usamos la longitud directamente
    const esUnicoCorreo = cantidadCorreos === 1; // Nueva variable para la condición de un solo correo
    const mensajeUnico = "Estimado contribuyente, se encontró un correo electrónico registrado en la municipalidad, aqui se enviarán sus credenciales temporales.";
    const MensajeMultiples = "Estimado contribuyente, se encontraron multiples correos electronicos, por favor seleccione uno para el envio de sus credenciales temporales.";
    const mostrarMensajes = esUnicoCorreo ? mensajeUnico : MensajeMultiples;

    const [showModalDatos, setShowModalDatos] = useState(false);
    const navigate = useNavigate();
    const [correoprincipal, setCorreoSeleccionado] = useState(cantidadCorreos > 0 ? correos[0] : "");

    useEffect(() => {
        if (cantidadCorreos > 0) {
            // Si hay correos, selecciona el primero por defecto.
            setCorreoSeleccionado(correos[0]);
        } else {
            setCorreoSeleccionado("");
        }
    }, [correos, cantidadCorreos]);



    // Funcion para confirmar el correo seleccionado
    const handleConfirmarCorreo = async () => {
        try {
            // Datos que se enviara al backend
            const response = await registrarCorreoPrincipal(identidad, registrotributario, correoprincipal);
            console.log("Correos disponibles: ", correos);
            console.log("Respuesta: ", response);

            if (response.status === 200) {
                console.log("Respuesta: Correo registrado correctamente: ", response);
                console.log("Correo seleccionado para enviar datos de activacion: ", correoprincipal);
                handleClose();
                // Esperamos un poco para que la modal principal cierre antes de abrir la de éxito
                setTimeout(() => setShowModalDatos(true), 200);
            } else {
                // Caso general de error
                toast.error("Ocurrió un error al registrar el correo.");
            }
        } catch (error) {
            console.error("Error al confirmar el correo:", error);
            toast.error("Solicitud Incorrecta.");
            handleClose();
        }
    };


    return (
        <>
            <Modal show={showSeleccionCorreos} onHide={handleClose} backdrop="static" keyboard={false} >
                <Toaster position="top-right" />
                <Modal.Header>
                    <Modal.Title>Selecciona tu correo electrónico</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='seleccionCorreo'>
                        {esUnicoCorreo ? (
                            // 1. Un solo correo: INPUT tipo texto no editable (readonly)
                            <input type="text" className='seleccionCorreo-input' value={correoprincipal} disabled />
                        ) : (

                            <select
                                className='seleccionCorreo-select'
                                onChange={(e) => setCorreoSeleccionado(e.target.value)}
                                value={correoprincipal}>
                                {correos.map((correo, index) => (
                                    <option key={index} value={correo} className='seleccionCorreo-select'>
                                        {correo}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                    {/* El mensaje se muestra igual para ambos casos, adaptándose a la lógica de 'mostrarMensajes' */}
                    <p className='mensajeCorreo' ><FaInfoCircle /> {mostrarMensajes}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button className='ButtonCerrar' variant="secondary" onClick={handleClose}>
                        Cerrar
                    </Button>
                    <Button className="ButtonSeleccion" variant="primary"
                        onClick={handleConfirmarCorreo}
                        // Se deshabilita el botón si no hay ningún correo seleccionado
                        disabled={!correoprincipal} >
                        Confirmar
                    </Button>
                </Modal.Footer>


            </Modal>

            {/* Reutilización de la ventana modal de éxito */}
            <Modals
                iconSrc="public\img\procesado.svg"
                isVisible={showModalDatos}
                title="Éxito"
                message={`Contraseña temporal enviada exitosamente en su correo de elección (${correoprincipal}), revise su correo.`}
                onClose={() => navigate('/')}
            />

        </>

    );
}

export default SeleccionCorreos;