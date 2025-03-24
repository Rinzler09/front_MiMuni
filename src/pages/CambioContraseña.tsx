import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/PagesStyles/cambioContraseñaStyles.css";
import Municipalidad from "../Components/ImagesComponents/Municipalidad";

// importación nuevas al proyectos
import type { cambioContraseña } from "../types/generalForm";
import ErrorMessage from "../Components/ErrorMessage.tsx/MostrarMensajesError";
import { useForm } from "react-hook-form";
import { cambiarContra } from "../services/CambioControseñaServices";
import { Toaster, toast } from "sonner";
import Modal from '../Components/ModalComponents/modalComponent';

// Importar estilos de bootstrap icons (si no lo has hecho globalmente)
import "bootstrap-icons/font/bootstrap-icons.css";

const CambioContraseña: React.FC = () => {
  const navigate = useNavigate();

  // Estados para mostrar/ocultar cada contraseña
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [showModalDatos, setShowModalDatos] = useState(false);

  // Validación de los campos del formulario
  const initialValues: cambioContraseña = {
    contraseña: "",
    confirmaContra: "",
  };

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

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
      toast.error(
        error?.message ?? "Error al actualizar la contraseña. Intente nuevamente."
      );
    }
  };

  return (
    <div className="container mt-5">
      <Toaster position="top-right" />
      <br />
      <div className="logoMuni">
        <Municipalidad />
      </div>
      <br />
      <div className="divTitlecontra">
        <h2 className="mb-4">Cambio de contraseña</h2>
      </div>

      <form id="datosPersonales" onSubmit={handleSubmit(handleContra)}>
        <div className="form-container-contraseña">
          {/* Campo de nueva contraseña */}
          <div className="mb-3">
            <label htmlFor="contraseña" className="form-label">
              Ingrese la nueva contraseña
            </label>
            {/* Usamos input-group para colocar el ícono de ojo a la derecha */}
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="Ingrese su nueva contraseña"
                {...register("contraseña", {
                  required: "La Nueva Contraseña es necesaria",
                  minLength: {
                    value: 12,
                    message:
                      "La contraseña debe contener un mínimo de 8 caracteres, incluyendo al menos una letra mayúscula y un carácter especial.",
                  },
                })}
              />
              <span
                className="input-group-text"
                style={{ cursor: "pointer" }}
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
              </span>
            </div>
            {errors.contraseña && (
              <ErrorMessage>{errors.contraseña.message}</ErrorMessage>
            )}
          </div>

          {/* Campo de confirmación de contraseña */}
          <div className="mb-3">
            <label htmlFor="confirmaContra" className="form-label">
              Confirme la nueva contraseña
            </label>
            <div className="input-group">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="form-control"
                placeholder="Repita su nueva contraseña"
                {...register("confirmaContra", {
                  required: "Es necesario que repita la Contraseña",
                  validate: (value) =>
                    value === password || "Las contraseñas no son iguales",
                })}
              />
              <span
                className="input-group-text"
                style={{ cursor: "pointer" }}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <i
                  className={`bi ${
                    showConfirmPassword ? "bi-eye-slash" : "bi-eye"
                  }`}
                ></i>
              </span>
            </div>
            {errors.confirmaContra && (
              <ErrorMessage>{errors.confirmaContra.message}</ErrorMessage>
            )}
          </div>
        </div>
        <button type="submit" className="btn-contraseña">
          Cambiar Contraseña
        </button>
      </form>

      {/* Reutilizacion de la ventana modal */}
      <Modal
        isVisible={showModalDatos}
        title="Éxito"
        message="Contraseña actualizada correctamente, ingrese sus credenciales para continuar."
        onClose={() => navigate("/")}
      />
    </div>
  );
};

export default CambioContraseña;