// src/Pages/CambioContraseña.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/PagesStyles/cambioContraseñaStyles.css";
import type { cambioContraseña } from "../../types/generalForm";
import ErrorMessage from "../../Components/ErrorMessage.tsx/MostrarMensajesError";
import { useForm } from "react-hook-form";
import "bootstrap-icons/font/bootstrap-icons.css";
import { receteoContraServices } from "../../services/EnvioCorreoElectronicoServices";
//import { cambiarContra } from "../../services/CambioControseñaServices";
import { useAuth } from "../../Auth/AuthContex";
import {Toaster, toast} from "sonner";
import Modal from "../../Components/attributeComponents/ModalComponents/modalComponent"
import { logoutUsuario } from "../../services/EliminacionCookie";
import { useSessionModal } from "../../hook/UseSessionTimeout";

const RestablecerContraseña: React.FC = () => {
  const navigate = useNavigate();
  const {token, logout} = useAuth(); //Extrae el token del context de autenticacion
  //console.log("Token desde RestablecerContra:",token);
  const { Modals } = useSessionModal();

    //Valores iniciales para el formualrio 
    const initialValues: cambioContraseña = {
        contraseña: "",
        confirmaContra: "",
      }

      
  // 1) Mode onChange para que formState.isValid se actualice al escribir
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<cambioContraseña>({ defaultValues: initialValues});

  //Comparar la contraseña 
  const password = watch("contraseña");
  const [isRecaptchaVerified, setIsRecaptchaVerified] = useState(false);
  const [isEmailSent, setIsEmailSent]             = useState(false);

  //Funcion para poder cambiar la pagina al login
  const navegacionLogin = async() =>{
    try {
      await logoutUsuario(token as string);
      navigate("/");
    } catch (error) {
      console.log("Error al  cerrar sesion:", error);
    }
  }

 

  const handleRecuperar = async (data: cambioContraseña) => {
    console.log("Envío de datos al backend", data);
    try {
      const response = await receteoContraServices(data.contraseña, token as string);
      console.log("Lo que se envia para el backend desde el frontend:", data)
      console.log("Token desde el hadleRecuperar:", token);
      if (typeof response === "object") {
        //toast.success(response.message);
        //toast.success(response?.message ?? "Contraseña actualizada correctamente");
        setTimeout(() => setShowModalDatos(true), 500);
      }else{
        toast.error("Ocurrio un problema al actualizar la contraseña");
      }
    } catch (error: any) {
      toast.error(error?.message ?? "Error al actualizar la contraseña, Intente nuevamente");
      console.log("Enviado correctamente con argumento");
    }
    // llamada real al API…
    setIsEmailSent(true);
  };

  //Estado para mostrar contraseña y ocultar
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [showModalDatos, setShowModalDatos] = useState<boolean>(false);



  return (
    
    <div className="reset-pass-page">
       <Toaster richColors position="top-right" />
      <div className="reset-pass-container">
        <h2 className="text-center mb-3">Restablece tu nueva contraseña</h2>
        <form onSubmit={handleSubmit(handleRecuperar)}>
          {/* contraseña */}
          <div className="email-field mb-3">
            <label htmlFor="contraseña" className="form-label">Ingresa una nueva contraseña</label>
            {/* Agracion de metodologia del input */}
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              placeholder="Ingrese nueva contraseña"
              {...register("contraseña", {
                required: "La contraseña es obligatoria",
                minLength:{value: 8, message: "la contraseña debe tener al menos 8 caracteres",},
                maxLength:{value: 50, message:"La contraseña no debe superar los 50 caracteres",},
                validate: {
                    //Valida que contenga al menos digito(acepto mas)
                    hasAtLeastOneDigit:(value: string) =>{
                        const digitCount = (value.match(/\d/g) || []).length;
                        return(
                            digitCount >=1 || "La contraseña debe contener al menos un numero."
                        );
                    },
                    //Valida que contenga Existente un caracter especial
                    hasOneSpecial:(value: string) =>{
                        const specialCount = (value.match(/[!@#$%^&*(),.?":{}|<>]/g) || []).length;
                        return(specialCount >= 1 || "Por seguridad, la contraseña debe incluir uno o más caracteres especiales.");
                    },
                    //Valida que contenga al menos una letra mayscula
                    hasUppercase:(value: string) =>
                        /[A-Z]/.test(value) || "La contraseña debe contener al menos una letra mayúscula.",
                },

              })}
            />
            <span className="input.group.text" style={{ cursor: "pointer" }} onClick={() => setShowPassword(prev => !prev)}>
                <i className={`bi ${showPassword ? "bi-eye" : "bi-eye-slash"}`}></i>
            </span>
            {errors.contraseña && (<ErrorMessage>{errors.contraseña.message}</ErrorMessage>)}
          </div>
          

        {/* validacion en la contraseña */}
        <div className="mb-3">
            <label htmlFor="confirmaContra" className="form-label"> Confirme la nueva contraseña</label>
                <input type={showConfirmPassword ? "text" : "password"} className="form-control" placeholder="Repita su nueva contraseña"
                {...register("confirmaContra", {
                    required: "Es necesario que repita la contraseña",
                    minLength: {value: 8, message: "La contraseña debe contener al menos 8 caracteres.",},
                    maxLength: {value: 50, message: "La contraseña no debe superar los 50 caracteres.",},
                    validate:  (value) => value === password || "Las contraseñas no coinciden.",
                })}
                />
                <span className="input.group.text" style={{cursor: "pointer"}}  onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <i className={`bi ${showConfirmPassword ? "bi-eye" : "bi-eye-slash"}`}></i>
                </span>
                {errors.confirmaContra && (<ErrorMessage>{errors.confirmaContra.message}</ErrorMessage>)}
                

            </div>


          {/* BOTÓN ENVIAR: requiere both email válido e reCAPTCHA */}
          <button type="submit" className="btn-contraseña mb-3">Cambiar Contraseña</button>
        </form>
        {/*Ventana modal para poder avisar que todo esta perfecto*/}
        <Modal isVisible={showModalDatos} title="Exito" message="La contraseña se actualizo correctamente."
               iconSrc="img/procesado.svg" iconAlt="Icono de exito" closeButtonLabel="Aceptar" onClose={() => navegacionLogin()} />
      </div>
      {/*La ventana modal*/}
     {Modals}
    </div>
   

    
  );
};

export default RestablecerContraseña;
