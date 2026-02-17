import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import "../style/PagesStyles/registrarUsuarioStyles.css";
import type { registroSolicitud } from '../types/generalForm';
import Municipalidad from '../Components/ImagesComponents/Municipalidad';

//Nuevas Importaciones al proyecto
import ErrorMessage from '../Components/ErrorMessage/MostrarMensajesError';
import { registrarSolicitud } from '../services/RegistroUsuarioServices';
import { Toaster, toast } from 'sonner';
import { mensajes } from '../util/message';
import SeleccionCorreos from '../Components/ModalComponents/modalSeleccionCorreos';

const RegistrarUsuario: React.FC = () => {
    // Validacion de los campos del formulario
    const initialValues: registroSolicitud = {dni: "", rtn: "", email: "", telefono: "", };
    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues });

    //Funcion para enviar el registro de la solicitud
    const [isSendingTPwd, setIsSendingTPwd] = useState(false); // hook para mostrar enviando en btnSolicitud 
  
    //Seleccion de correos electronicos
    const [showSeleccionCorreos, setShowSeleccionCorreos] = useState(false);
    const handleClose = () => setShowSeleccionCorreos(false);
    //Estado para almacenar los correos
    const [correosDisponibles, setCorreosDisponibles] = useState<string[]>([]);

    //Funcion para poder enviar datos al componente de seleccion de correos
    const [datosClientes, setDatosClientes] = useState<{identidad:string, registrotributario:string } | null>(null);
   
    const handleRegistrar = async (formData: registroSolicitud) => {
        setIsSendingTPwd(true);
        try {
            // Enviar datos al backend
            const response = await registrarSolicitud( formData.dni, formData.rtn, formData.email, formData.telefono);
            const emailPrincipal = formData.email;
           if (typeof response === "object") {
            toast.success(response.message);
            setDatosClientes({identidad: formData.dni, registrotributario: formData.rtn});
            console.log("Datos del cliente guardados: ", {identidad: formData.dni, registrotributario: formData.rtn});
            console.log("Respuesta del backend al registrar usuario: ", response);

            // 2. Obtener la lista de correos del backend
            const obteniendoCorreos: string[] = (response as any).body?.emails || []; 
            console.log("Correos obtenidos del backend: ", obteniendoCorreos);
            // 3. COMBINAR: Aseguramos que el email ingresado sea el primero y eliminamos duplicados
            const correosUnificados = [emailPrincipal, ...obteniendoCorreos];
            const correosUnicos = Array.from(new Set(correosUnificados));

            //  USAR LA LISTA FINAL QUE INCLUYE EL EMAIL DEL FORMULARIO
            if (correosUnicos.length > 0) {
                setCorreosDisponibles(correosUnicos); 
                setTimeout(() => setShowSeleccionCorreos(true), 2000); // Abrir el modal de selección
            } 
        } else {
            toast.error(response.message);
        }
        } catch (error: any) {
            //toast.error(error?.message ?? "Usuario no registrado.");
            toast.error(mensajes["credenciales incorrectas"].mensaje);
        } finally {
            setIsSendingTPwd(false);
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

                    <div className="row mb-3">

                       
                        <div className="col-md-6">
                            <label htmlFor="identidad" className="form-label">
                                DNI
                            </label>
                            <input
                                type="text" className="form-control" maxLength={13} placeholder='Ingrese su numero de identidad'
                                {...register("dni", {
                                    required: "El DNI es obligatorio",
                                    minLength: { value: 13, message: "El DNI debe tener exactamente 13 caracteres", },
                                    maxLength: { value: 13, message: "El DNI debe tener exactamente 13 caracteres", },
                                    pattern: { value: /^[0-9]+$/, message: "El DNI solo debe contener números", },
                                })}
                            />
                            {errors.dni && <ErrorMessage>{errors.dni.message} </ErrorMessage>}
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="rtn" className="form-label">
                                RTN
                            </label>
                            <input
                                type="text" className="form-control" maxLength={14} placeholder='Ingrese su RTN'
                                {...register("rtn", {
                                    required: "El RTN es obligatorio",
                                    minLength: { value: 14, message: "El RTN debe tener exactamente 14 caracteres", },
                                    maxLength: { value: 14, message: "El RTN debe tener exactamente 14 caracteres", },
                                    pattern: { value: /^[0-9]+$/, message: "El RTN solo debe contener números", },
                                })}
                            />
                            {errors.rtn && <ErrorMessage>{errors.rtn.message} </ErrorMessage>}
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="correo" className="form-label">
                                Correo Electronico
                            </label>
                            <input
                                type="text" className="form-control" placeholder='Ingrese su correo electronico'
                                {...register('email', {
                                    required: "El EMAIL es obligatorio", pattern: { value: /\S+@\S+\.\S+/, message: "El correo electronico es invalidado", },
                                })}
                            />
                            {errors.email && <ErrorMessage>{errors.email.message} </ErrorMessage>}
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="telefono" className="form-label">
                                Telefono

                            </label>
                            <input
                                type="tel" className="form-control" placeholder='Ingrese su numero de telefono' maxLength={8}
                                {...register("telefono", {
                                    required: "El TELEFONO es obligatoria",
                                    minLength: { value: 8, message: "El TELEFONO debe tener exactamente 8 caracteres", },
                                    maxLength: { value: 8, message: "El TELEFONO debe tener exactamente 8 caracteres", },
                                })}
                            />
                            {errors.telefono && <ErrorMessage>{errors.telefono.message} </ErrorMessage>}
                        </div>
                    </div>
                </div>
                <button type="submit" className="btn btn-primary"  >
                    {isSendingTPwd ? 'Activando...' : 'Activar Cuenta'}
                    
                </button>
                {/* En este caso se envia la parte */}
                <SeleccionCorreos showSeleccionCorreos={showSeleccionCorreos} handleClose={handleClose} correos={correosDisponibles}
                identidad={datosClientes?.identidad || ""}
                registrotributario={datosClientes?.registrotributario || ""}
                />
            </form>

        </div >
    );
};
export default RegistrarUsuario;
