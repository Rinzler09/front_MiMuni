import React, { useState } from 'react';
import  { useForm } from 'react-hook-form';
import "../style/PagesStyles/registrarUsuarioStyles.css";
import { useNavigate } from "react-router-dom";
import type { registroSolicitud } from '../types/generalForm';
import Municipalidad from '../Components/ImagesComponents/Municipalidad';

//Nuevas Importaciones al proyecto
import ErrorMessage from '../Components/ErrorMessage.tsx/MostrarMensajesError';
import {registrarSolicitud} from '../services/RegistroUsuarioServices';
import { Toaster,toast } from 'sonner';
import Modal from '../Components/ModalComponents/modalComponent';
import { mensajes } from '../util/message';


const interpretarMensaje = (
    mensajeBackend: string
  ): { mensaje: string; tipo: "success" | "error" | "info" | "post" } => {
    const mensaje = mensajeBackend.toLowerCase();
    for (const key in mensajes) {
      if (mensaje.includes(key)) {
        return mensajes[key];
      }
    }
    // Si no coincide con ningún mapeo, se retorna el mensaje original como éxito
    return { mensaje: mensajeBackend, tipo: "success" };
  };
  

const RegistrarUsuario: React.FC = () => {
    const [showModalDatos, setShowModalDatos] = useState(false);
    const navigate = useNavigate();
    // Validacion de los campos del formulario
    const initialValues: registroSolicitud = { nombrecompleto: "",identidad: "",rtn: "",correo: "",telefono: "",};
    //
    const { register, handleSubmit,formState: { errors } } = useForm({defaultValues: initialValues});

    const [tempPwd, setTempPwd]= useState("");
    //Funcion para enviar el registro de la solicitud
    const handleRegistrar = async (formData: registroSolicitud) => {
        try {
            // Enviar datos al backend
            const response = await registrarSolicitud(formData.nombrecompleto,formData.identidad,formData.rtn,formData.correo,formData.telefono);
          if (typeof response === "object") {
            toast.success(response.message);
            setTimeout(() => setShowModalDatos(true), 5000);// Nos ayudara para cuando se termine la confirmacion de de registro registrado, pasara 5 segundo para abrir la ventana modal
            setTempPwd(response.pswdTemp);
        } else {
            toast.error(response.message);
        }
        } catch (error: any) {
            //toast.error(error?.message ?? "Usuario no registrado.");
            toast.error(mensajes["credenciales incorrectas"].mensaje);
        }

        
    };


    return (
        <div className="container mt-5">
            <Toaster position="top-right" /> {/* Para la visualizacion */}
            <br />
            <div className='logoMuni'><Municipalidad /></div>
            <br />
            <div className='divTitle'><h2 className="mb-4" >Ingrese sus datos personales</h2></div>

            <form id='datosPersonales' onSubmit={handleSubmit(handleRegistrar)} >
                <div className='form-container'>
                    <div className="row mb-3 linea">
                        <div className="col-md-6">
                            <label htmlFor="nombrecompleto" className="form-label">
                                Nombre
                            </label>
                            <input
                                type="text" className="form-control" placeholder='Ingrese su nombre'{...register('nombrecompleto', { required: "El Nombre es obligatorio" })}
                            />
                            {errors.nombrecompleto && <ErrorMessage>{errors.nombrecompleto.message} </ErrorMessage>}
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="identidad" className="form-label">
                                DNI
                            </label>
                            <input
                                type="text" className="form-control" maxLength={13} placeholder='Ingrese su numero de identidad' 
                                {...register("identidad", {required: "La DNI es obligatoria",
                                    minLength: {value: 13,message: "El DNI debe tener exactamente 13 caracteres",},
                                    maxLength: {value: 13,message: "El DNI debe tener exactamente 13 caracteres",},
                                    pattern: {value: /^[0-9]+$/,message: "El DNI solo debe contener números",}, })}
                            />
                             {errors.identidad && <ErrorMessage>{errors.identidad.message} </ErrorMessage>}
                        </div>      
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label htmlFor="rtn" className="form-label">
                                RTN
                            </label>
                            <input
                                type="text" className="form-control" maxLength={14} placeholder='Ingrese su RTN' 
                                {...register("rtn", {required: "El RTN es obligatorio",
                                    minLength: {value: 14,message: "El RTN debe tener exactamente 14 caracteres",},
                                    maxLength: {value: 14,message: "El RTN debe tener exactamente 14 caracteres",},
                                    pattern: {value: /^[0-9]+$/,message: "El RTN solo debe contener números",},})}
                            />
                          {errors.rtn && <ErrorMessage>{errors.rtn.message} </ErrorMessage>}
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="correo" className="form-label">
                                Correo Electronico
                            </label>
                            <input
                                type="text" className="form-control" placeholder='Ingrese su correo electronico'
                                {...register('correo', { required: "El EMAIL es obligatorio", pattern: { value: /\S+@\S+\.\S+/, message: "El correo electronico es invalidado", },
                                 })}
                            />
                             {errors.correo && <ErrorMessage>{errors.correo.message} </ErrorMessage>}
                        </div>
                        
                        <div className="col-md-6">
                            <label htmlFor="telefono" className="form-label">
                                Telefono
                                
                            </label>
                            <input
                                type="tel" className="form-control" placeholder='Ingrese su numero de telefono' maxLength={8}
                                {...register("telefono", {
                                    required: "El TELEFONO es obligatoria",
                                    minLength: {value: 8,message: "El TELEFONO debe tener exactamente 8 caracteres",},
                                    maxLength: {value: 8,message: "El TELEFONO debe tener exactamente 8 caracteres",},})}
                            />
                            {errors.telefono && <ErrorMessage>{errors.telefono.message} </ErrorMessage>}
                        </div>
                    </div>
                </div>
                <button type="submit" className="btn btn-primary" onClick={handleSubmit(handleRegistrar)} >Enviar Solicitud</button>
            </form>

            {/*Reutilizacion de la ventana modal*/}
            <Modal
                isVisible={showModalDatos}
                title="Éxito"
                message={`Contraseña temporal enviada exitosamente, verifique su correo `}
                onClose={() => navigate('/')}
            />
        </div >
    );
};
export default RegistrarUsuario;
