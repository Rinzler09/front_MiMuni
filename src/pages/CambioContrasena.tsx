import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../style/PagesStyles/cambioContraseñaStyles.css";
import Municipalidad from "../Components/ImagesComponents/Municipalidad";
// Importación nuevas al proyecto
import type { cambioContrasena } from "../types/generalForm";
import ErrorMessage from "../Components/ErrorMessage.tsx/MostrarMensajesError";
import { useForm } from "react-hook-form";
import { cambiarContra } from "../services/CambioControseñaServices";
import { Toaster, toast } from "sonner";
import Modal from "../Components/ModalComponents/modalComponent";
import { useAuth } from "../Auth/AuthContext";
import "bootstrap-icons/font/bootstrap-icons.css"; // Importar estilos de bootstrap icons (si no lo has hecho globalmente)
import { useSessionTimeout } from "../hook/UseSessionTimeout";
// import { useSessionModal } from "../hook/UseSessionTimeout";

const CambioContrasena: React.FC = () => {
  const navigate = useNavigate();
  // const location = useLocation(); //llamamos a este hook para ver donde estamos ubicados actualmente y asi saber 
  // que solo se navegara a(/) si estamos en la pantalla actual de cambio-contraseña  

  // Estados para mostrar/ocultar cada contraseña
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [showModalDatos, setShowModalDatos] = useState<boolean>(false);

  // Valores iniciales para el formulario
  const initialValues: cambioContrasena = {
    contrasena: "",
    confirmaContra: "",
  };

  const { register, watch, handleSubmit,
    formState: { errors },
  } = useForm<cambioContrasena>({ defaultValues: initialValues });

  const { token } = useAuth(); // Extrae el token del contexto de autenticación
  // const location = useLocation();

  // const { Modals } = useSessionModal(); 
  const { Modals, handleExpire } = useSessionTimeout({ //Esto nos ayudara para las ventanas modales del temporizador
    onExpire: () => {
      console.log("Esta es la location de la ruta: ", window.location.pathname);
      if (window.location.pathname === "/cambio-contrasena") { //solo navegara al indice si estamos en esta pantalla cambio contraseña ya que es en donde estamos trabajando
        navigate("/");//esto redirigira al login form cuando el expireTimer llegue a 0 en useSessionTimeOut 
      }
    },
    isOTimeSession: true,
  });

  // useEffect(() => {
  //   console.log("Se actualizo la pagina y se perdieron las modales");
  // }, [Modals]);

  // Observa el valor de la contraseña para compararla con la confirmación
  const password = watch("contrasena");
  const [isChngPPwd, setIsChngPPwd] = useState(false);//hook para cambiar el texto del btn Cambio de Contra

  const handleContra = async (formData: cambioContrasena) => {
    setIsChngPPwd(true);
    try {
      // Envía la nueva contraseña usando el servicio
      // Cierra sesión antes de cambiar la contraseña
      const response = await cambiarContra(formData.contrasena);
      if (typeof response === "object") {
        toast.success(response.message);
        setTimeout(() => setShowModalDatos(true), 500);
      } else {
        toast.error("Ocurrió un problema al actualizar la contraseña.");
      }
    } catch (error: any) {
      toast.error(error?.message ?? "Error al actualizar la contraseña. Intente nuevamente.");
    } finally {
      setIsChngPPwd(false);
    }
  };

  // funcion para borrar la cookie y cerrar sesion
  const cerrar = async () => {
    try {
      console.log("entro a la funcion Cerrar la cual limpia registros y llama a handleExpire");
      // await logoutUsuario(token as string);
      handleExpire();
      navigate("/");
      // if (location.pathname === "cambio-contraseña") { //solo navegara al indice si estamos en esta pantalla 
      //   console.log("Navego a / porque estaba dentro de cambio de contraseña");
      //   navigate("/");
      // }

    } catch (error) {
      // console.log("Hubo un error al cerrar ");
      // console.log("Este es el pathname: ", location.pathname);
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
                {...register("contrasena", {
                  required: "La Nueva Contraseña es necesaria",
                  minLength: { value: 8, message: "La contraseña debe contener al menos 8 caracteres.", },
                  maxLength: { value: 50, message: "La contraseña no debe superar los 50 caracteres.", }, validate: {
                    // Valida que contenga al menos un dígito.
                    hasAtLeastOneDigit: (value: string) => {
                      const digitCount = /\d/g.test(value);
                      return (digitCount || "La contraseña debe contener al menos un número.");
                    },
                    // Valida que contenga EXACTAMENTE un carácter especial
                    hasOneSpecial: (value: string) => {
                      if (/[^\w-!@#$%^&*()_=+]/.test(value)) {
                        return "La contraseña solo puede contener estos caracteres especiales -!@#$%^&*()_=+";
                      }
                      //const specialCount = (value.match(/[!@#$%^&*(),.?":{}|<>]/g) || []).length;
                      const specialCount = /[-!@#$%^&*()_=+]/g.test(value);//este es el arreglo de caracteres especiales que valida el Login From
                      return (specialCount || "Por seguridad, la contraseña debe incluir al menos uno de estos caracteres -!@#$%^&*()_=+");
                    },
                    // Valida que contenga al menos una letra mayúscula
                    hasUppercase: (value: string) => /[A-Z]/.test(value) || "La contraseña debe contener al menos una letra mayúscula.",
                  },
                })} />

              <span className="input-group-text" style={{ cursor: "pointer" }} onClick={() => setShowPassword(!showPassword)}>
                <i className={`bi ${showPassword ? "bi-eye" : "bi-eye-slash"}`}></i>
              </span>
            </div>
            {errors.contrasena && (<ErrorMessage>{errors.contrasena.message}</ErrorMessage>)}
          </div>

          {/* Campo de confirmación de contraseña */}
          <div className="mb-3">
            <label htmlFor="confirmaContra" className="form-label"> Confirme la nueva contraseña </label>
            <div className="input-group">
              <input type={showConfirmPassword ? "text" : "password"} className="form-control" placeholder="Repita su nueva contraseña"
                {...register("confirmaContra", {
                  required: "Es necesario que repita la Contraseña",
                  minLength: { value: 8, message: "La contraseña debe contener al menos 8 caracteres.", },
                  maxLength: { value: 50, message: "La contraseña no debe superar los 50 caracteres.", },
                  validate: (value) => value === password || "Las contraseñas no son iguales",
                })} />
              <span className="input-group-text" style={{ cursor: "pointer" }} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                <i className={`bi ${showConfirmPassword ? "bi-eye" : "bi-eye-slash"}`}></i>
              </span>
            </div>
            {errors.confirmaContra && (<ErrorMessage>{errors.confirmaContra.message}</ErrorMessage>)}
          </div>
        </div>
        <button type="submit" className="btn-contraseña">
          {isChngPPwd ? 'Cambiando...' : 'Cambiar Contraseña'}
        </button>
      </form>

      {/* Reutilización de la ventana modal */}
      <Modal iconSrc="public\img\procesado.svg" isVisible={showModalDatos} title="Éxito"
        message="Contraseña actualizada correctamente, ingrese sus credenciales para continuar." onClose={() => cerrar()} />
      {Modals}
    </div>
  );
};

export default CambioContrasena;//mala practica llevaba ñ
