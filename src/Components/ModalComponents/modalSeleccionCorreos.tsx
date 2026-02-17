import React, { useState, useEffect } from 'react';
import {Button, Modal } from 'react-bootstrap';
import '../../style/ModalesStyles/PageModal/modalSeleccionCorreos.css';
import { registrarCorreoPrincipal } from '../../services/correoPrincipalServices';
import Modals from './modalComponent';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import { FaInfoCircle } from "react-icons/fa";
import Select from 'react-select';

interface Props {
    showSeleccionCorreos: boolean;
    handleClose: () => void;
    correos: string[];
    descripcion?: string;
    identidad:string;
    registrotributario:string;
}

const SeleccionCorreos: React.FC<Props> = ({ showSeleccionCorreos, handleClose, correos, identidad, registrotributario}) => {

    // Mensaje que se mostrará dependiendo de la cantidad de correos
    const cantidadCorreos = correos.length; // Usamos la longitud directamente
    const esUnicoCorreo = cantidadCorreos === 1; // Nueva variable para la condición de un solo correo
    const mensajeUnico = "Estimado contribuyente, se encontró un correo electrónico registrado. Aquí se enviarán sus credenciales temporales.";
    const MensajeMultiples =  "Estimado contribuyente, se encontraron múltiples correos electrónicos registrados. Por favor seleccione uno para el envió de sus credenciales temporales."; 
    const mostrarMensajes = esUnicoCorreo ? mensajeUnico : MensajeMultiples;
    
    const [showModalDatos, setShowModalDatos] = useState(false);
    const navigate = useNavigate();
    const [correoprincipal, setCorreoSeleccionado ] = useState(cantidadCorreos > 0 ? correos[0] : "");
    const options = correos.map(c => ({ value: c, label: c }));
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
            const response = await registrarCorreoPrincipal(identidad, registrotributario, correoprincipal );
            console.log("Correos disponibles: ", correos);
            if (typeof response === "object" ) {
             console.log("Respuesta: Correo registrado correctamente: ", response);
             console.log("Correo seleccionado para enviar datos de activacion: ", correoprincipal);
             handleClose();
             // Esperamos un poco para que la modal principal cierre antes de abrir la de éxito
             setTimeout(() => setShowModalDatos(true), 200); 
            } else if (response && typeof response === "string") {
                // Aquí podrías manejar un caso en que la respuesta es un error en forma de string
                toast.error(response);
            } else {
                // Caso general de error
                toast.error("Ocurrió un error al registrar el correo.");
            }   
        } catch (error: any) {
            console.error("Error al confirmar el correo:", error);
            toast.error(error);
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
                    // Un solo correo: INPUT tipo texto no editable (readonly)
                    <input type="text" className='seleccionCorreo-input' value={correoprincipal} disabled />
                ) : (
                    
                   <Select className="seleccionCorreo-select" classNamePrefix="react-select"
                        options={options}
                        defaultValue={options.find(op => op.value === correoprincipal)}
                        onChange={(selected) => setCorreoSeleccionado(selected?.value ?? "")}
                        styles={{
                        // Estas partes NO se pueden mover al CSS
                        option: (base, state) => ({
                            ...base,
                            background: state.isFocused ? "#c85a11ff" : "white",
                            color: state.isFocused ? "white" : "black",
                            padding: 10,
                            cursor: "pointer",
                            borderRadius: 5,
                            transition: "max-height 0.4s ease, opacity 0.4s ease",
                            
                        }),
                        menu: (base) => ({
                            ...base,
                            borderRadius: 10,
                            boxShadow: "0 4px 16px rgba(227, 15, 15, 0.12)",
                            transition: "max-height 0.4s ease, opacity 0.4s ease",
                        })}}/>
                )}
            </div>
            {/* El mensaje se muestra igual para ambos casos, adaptándose a la lógica de 'mostrarMensajes' */}
            <p className='mensajeCorreo' ><FaInfoCircle/> {mostrarMensajes}</p>
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
                message={`Contraseña temporal enviada exitosamente en su correo de elección (${correoprincipal}), verifique su correo.`} 
                onClose={() => navigate('/')} />
        </>
        
    );
}

export default SeleccionCorreos;