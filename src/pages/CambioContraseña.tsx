import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/PagesStyles/cambioContraseñaStyles.css";
import Municipalidad from "../Components/ImagesComponents/Municipalidad";

//importacion nuevas al proyectos
import type { cambioContraseña } from "../types/generalForm";
import ErrorMessage from "../Components/ErrorMessage.tsx/MostrarMensajesError";
import { useForm } from "react-hook-form";
import { cambiarContra } from "../services/CambioControseñaServices";
import { Toaster, toast } from "sonner";
import Modal from '../Components/ModalComponents/modalComponent';

const CambioContraseña: React.FC = () => {
  const [showModalDatos, setShowModalDatos] = useState(false);
  const navigate = useNavigate();

  // Validación de los campos del formulario
  const initialValues: cambioContraseña = {contraseña: "",confirmaContra: "",};
  const {register,watch,handleSubmit,formState: { errors },} = useForm({ defaultValues: initialValues });

  // Validación de contraseña
  const password = watch("contraseña");
  const handleContra = async (formData: cambioContraseña) => {
    try {
      // Envía la nueva contraseña usando el servicio
      const response = await cambiarContra(formData.contraseña);
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
  

  return (
    <div className="container mt-5">
      <Toaster position="top-right" />
      <br />
      <div className="logoMuni"><Municipalidad /></div>
      <br />
      <div className="divTitlecontra"><h2 className="mb-4">Cambio de contraseña</h2></div>

      <form id="datosPersonales" onSubmit={handleSubmit(handleContra)}>
        <div className="form-container-contraseña">
          <div className="mb-3">
            <label htmlFor="contraseña" className="form-label">
              Ingrese la nueva contraseña
            </label>
            <input
              type="password" className="form-control" placeholder="Ingrese su nueva contraseña"
              {...register("contraseña", {
                required: "La Nueva Contraseña es necesaria",
                minLength: { value: 12, message: "La contraseña debe contener un mínimo de 8 caracteres, incluyendo al menos una letra mayúscula y un carácter especial.",},
              })}
            />
            {errors.contraseña && (<ErrorMessage>{errors.contraseña.message}</ErrorMessage>)}
          </div>

          <div className="mb-3">
            <label htmlFor="confirmaContra" className="form-label">
              Repita la nueva contraseña
            </label>
            <input
              type="password" className="form-control" placeholder="Repita su nueva contraseña"
              {...register("confirmaContra", { required: "Es necesario que repita la Contraseña", validate: (value) => value === password || "Las contraseñas no son iguales",})}
            />
            {errors.confirmaContra && (<ErrorMessage>{errors.confirmaContra.message}</ErrorMessage>)}
          </div>
        </div>
        <button type="submit" className="btn-contraseña">Cambiar Contraseña</button>
      </form>

       {/*Reutilizacion de la ventana modal*/}
       <Modal
                isVisible={showModalDatos}
                title="Éxito"
                message="Contraseña actualizada correctamente, ingrese sus credenciales para continuar."
                onClose={() => navigate('/')}
            />
        </div >
  );
};

export default CambioContraseña;
