import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/PagesStyles/cambioContraseñaStyles.css";
import Municipalidad from "../Components/ImagesComponents/Municipalidad";

// Importación nuevas al proyecto
import type { cambioContraseña } from "../types/generalForm";
import ErrorMessage from "../Components/ErrorMessage.tsx/MostrarMensajesError";
import { useForm } from "react-hook-form";
import { cambiarContra } from "../services/CambioControseñaServices";
import { Toaster, toast } from "sonner";
import Modal from "../Components/attributeComponents/ModalComponents/modalComponent";
import { useAuth } from "../Auth/AuthContex";
import { logoutUsuario } from "../services/EliminacionCookie";
import "bootstrap-icons/font/bootstrap-icons.css"; // Importar estilos de bootstrap icons (si no lo has hecho globalmente)
import { useSessionModal } from "../hook/UseSessionTimeout";

const CambioContraseña: React.FC = () => {
  const navigate = useNavigate();

  // Estados para mostrar/ocultar cada contraseña
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [showModalDatos, setShowModalDatos] = useState<boolean>(false);

  // Valores iniciales para el formulario
  const initialValues: cambioContraseña = {
    contraseña: "",
    confirmaContra: "",
  };

  const { register, watch, handleSubmit,
    formState: { errors },
  } = useForm<cambioContraseña>({ defaultValues: initialValues });

  const { token } = useAuth(); // Extrae el token del contexto de autenticación
  const {Modals} = useSessionModal(); //Esto nos ayudara para las ventana modal

  // Observa el valor de la contraseña para compararla con la confirmación
  const password = watch("contraseña");
  const handleContra = async (formData: cambioContraseña) => {
    try {
      // Envía la nueva contraseña usando el servicio
      // Cierra sesión antes de cambiar la contraseña
      const response = await cambiarContra(formData.contraseña, token as string);
      if (typeof response === "object") {
        toast.success(response.message);
        setTimeout(() => setShowModalDatos(true), 500);
      } else {
        toast.error("Ocurrió un problema al actualizar la contraseña.");
      }
    } catch (error: any) {
      toast.error(error?.message ?? "Error al actualizar la contraseña. Intente nuevamente.");
    }
  };

  // funcion para borrar la cookie y cerrar sesion
  const cerrar = async() => {
    try {
      await logoutUsuario(token as string);
      navigate("/");
      // Limpiar el estado de autenticación

    } catch (error) {
    //Mensaje de error
      
    }
  }

  return (
    <div className="container mt-5">
      <Toaster position="top-right" />
      <br />
      <div className="logoMuni"> <Municipalidad /> </div>
      <br />

      <div className="divTitlecontra"> <h2 className="mb-4">Cambio de contraseña</h2> </div>

      <form id="datosPersonales" onSubmit={handleSubmit(handleContra)}>
        <div className="form-container-contraseña">
          {/* Campo de nueva contraseña */}
          <div className="mb-3">
            <label htmlFor="contraseña" className="form-label"> Ingrese la nueva contraseña </label>
            {/* Usamos input-group para colocar el ícono de ojo a la derecha */}
            <div className="input-group">
              <input type={showPassword ? "text" : "password"} className="form-control"
                placeholder="Ingrese su nueva contraseña"
                {...register("contraseña", { required: "La Nueva Contraseña es necesaria",
                  minLength: { value: 8, message: "La contraseña debe contener al menos 8 caracteres.",},
                  maxLength: { value: 50, message: "La contraseña no debe superar los 50 caracteres.", }, validate: {
                    // Valida que contenga al menos un dígito.
                    hasAtLeastOneDigit: (value: string) => {
                      const digitCount = (value.match(/\d/g) || []).length;
                      return ( digitCount >= 1 || "La contraseña debe contener al menos un número.");},
                    // Valida que contenga EXACTAMENTE un carácter especial
                    hasOneSpecial: (value: string) => { const specialCount = (value.match(/[!@#$%^&*(),.?":{}|<>]/g) || []).length;
                      return ( specialCount >= 1 || "Por seguridad, la contraseña debe incluir uno o más caracteres especiales.");},
                    // Valida que contenga al menos una letra mayúscula
                    hasUppercase: (value: string) => /[A-Z]/.test(value) || "La contraseña debe contener al menos una letra mayúscula.",},})}/>

              <span className="input-group-text" style={{ cursor: "pointer" }} onClick={() => setShowPassword(!showPassword)}>
                <i className={`bi ${showPassword ? "bi-eye" : "bi-eye-slash"}`}></i>
              </span>
            </div>
            {errors.contraseña && (<ErrorMessage>{errors.contraseña.message}</ErrorMessage>)}
          </div>

          {/* Campo de confirmación de contraseña */}
          <div className="mb-3">
            <label htmlFor="confirmaContra" className="form-label"> Confirme la nueva contraseña </label>
            <div className="input-group">
              <input type={showConfirmPassword ? "text" : "password"} className="form-control" placeholder="Repita su nueva contraseña"
                {...register("confirmaContra", { required: "Es necesario que repita la Contraseña",
                  minLength: { value: 8, message: "La contraseña debe contener al menos 8 caracteres.", },
                  maxLength: { value: 50, message: "La contraseña no debe superar los 50 caracteres.",},
                  validate: (value) => value === password || "Las contraseñas no son iguales",})}/>
              <span className="input-group-text" style={{ cursor: "pointer" }} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                <i className={`bi ${showConfirmPassword ? "bi-eye" : "bi-eye-slash"}`}></i>
              </span>
            </div>
            {errors.confirmaContra && (<ErrorMessage>{errors.confirmaContra.message}</ErrorMessage>)}
          </div>
        </div>
        <button type="submit" className="btn-contraseña">
          Cambiar Contraseña
        </button>
      </form>

      {/* Reutilización de la ventana modal */}
      <Modal isVisible={showModalDatos} title="Éxito" message="Contraseña actualizada correctamente, ingrese sus credenciales para continuar." onClose={() => cerrar()}/>
       {Modals}
    </div>
  );
};

export default CambioContraseña;
