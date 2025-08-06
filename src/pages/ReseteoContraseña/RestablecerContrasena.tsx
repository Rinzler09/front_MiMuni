// src/Pages/CambioContraseña.tsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../style/PagesStyles/ReseteoContraseñaStyle/restablecerContrasenaStyle.css";
import type { cambioContrasena } from "../../types/generalForm";
import ErrorMessage from "../../Components/ErrorMessage.tsx/MostrarMensajesError";
import { useForm } from "react-hook-form";
import "bootstrap-icons/font/bootstrap-icons.css";
import { receteoContraServices } from "../../services/EnvioEmailServices";
//import { cambiarContra } from "../../services/CambioControseñaServices";
import { useAuth } from "../../Auth/AuthContext";
import { Toaster, toast } from "sonner";
import Modal from "../../Components/ModalComponents/modalComponent";
// import { useSessionModal } from "../../hook/UseSessionTimeout";
import { useSessionTimeout } from "../../hook/UseSessionTimeout";

const RestablecerContrasena: React.FC = () => {
  const navigate = useNavigate();
  // const location = useLocation();
  //const { token, logout } = useAuth(); //Extrae el token del context de autenticacion
  //console.log("Token desde RestablecerContra:",token);
  // const token = sessionStorage.getItem("access_TKN");
  const { Modals } = useSessionTimeout({
    onExpire: () => {
      console.log("Esta es la location de la ruta: ", window.location.pathname);
      if (window.location.pathname === "/restablecer-contrasena") { //solo navegara al indice si estamos en esta pantalla cambio contraseña ya que es en donde estamos trabajando
        navigate("/");//esto redirigira al login form cuando el expireTimer llegue a 0 en useSessionTimeOut 
      }
    },
    isOTimeSession: true,
  });
  const { tokenOT } = useAuth();//se guarda mendiante hook en AuthContext

  //Valores iniciales para el formualrio 
  const initialValues: cambioContrasena = {
    contrasena: "",
    confirmaContra: "",
  }


  // 1) Mode onChange para que formState.isValid se actualice al escribir
  const {
    register,
    handleSubmit,
    watch,// OJO, Validar para que funciona el watch
    formState: { errors }
  } = useForm<cambioContrasena>({ defaultValues: initialValues });

  //Comparar la contraseña 
  const password = watch("contrasena");
  const [isRecaptchaVerified, setIsRecaptchaVerified] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isChngPwd, setIsChngPwd] = useState(false);//hook para validar si se esta restableciendo la PWD

  //Funcion para poder cambiar la pagina al login
  const navegacionLogin = async () => {
    try {
      // await logoutUsuario(token as string); esta pantalla no usa cookie de refreshToken
      console.log("entro en logout");
      sessionStorage.removeItem("access_TKN_OT");
      navigate("/");

    } catch (error) {
      console.log("Error al  cerrar sesion:", error);
    }
  }



  const handleRecuperar = async (data: cambioContrasena) => {
    console.log("Envío de datos al backend", data);
    setIsChngPwd(true);
    try {
      console.log("Lo que se envia para el backend desde el frontend:", data)
      console.log("Token desde el hadleRecuperar:", tokenOT);
      const response = await receteoContraServices(data.contrasena, tokenOT as string);

      if (typeof response === "object") {
        //toast.success(response.message);
        //toast.success(response?.message ?? "Contraseña actualizada correctamente");
        setTimeout(() => setShowModalDatos(true), 500);
      } else {
        toast.error("Ocurrio un problema al actualizar la contraseña");
      }
    } catch (error: any) {
      toast.error(error?.message ?? "Error al actualizar la contraseña, Intente nuevamente");
      console.log("Enviado correctamente con argumento");
    } finally {
      setIsChngPwd(false);
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
        <h2 className="text-center mb-3">Restablece tu contraseña</h2>
        <form onSubmit={handleSubmit(handleRecuperar)}>
          {/* contraseña */}
          <div className="email-field mb-3">
            <label htmlFor="contraseña" className="form-label">Ingresa una nueva contraseña</label>
            {/* Agracion de metodologia del input */}
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              placeholder="Ingrese nueva contraseña"
              {...register("contrasena", {
                required: "La contraseña es obligatoria",
                minLength: { value: 8, message: "la contraseña debe tener al menos 8 caracteres", },
                maxLength: { value: 50, message: "La contraseña no debe superar los 50 caracteres", },
                validate: {
                  //Valida que contenga al menos digito(acepto mas)
                  hasAtLeastOneDigit: (value: string) => {
                    const digitCount = /\d/g.test(value);
                    return (
                      digitCount || "La contraseña debe contener al menos un numero."
                    );
                  },
                  //Valida que contenga Existente un caracter especial
                  hasOneSpecial: (value: string) => {

                    if (/[^\w-!@#$%^&*()_=+]/.test(value)) {//En esta condicion se utiliza para poder validar que solo acepte los caracteres permitido
                      //que esta dentro del arreglo personalizado, es decir si el usuario agrega un caracter que esta dentro del rango y despues agrega
                      //otro sera automaticamente invalido y le mostrarar el mensahe del return
                      //se utilia el \w porque este equivale cualquier caracter alfanumerico(Letra mayuscula o digitos)
                      return "La contraseña solo puede contener estos caracteres especiales -!@#$%^&*()_=+";// mensaje que retorna al momento de validar 
                      // si encuentra otro caracter que no esta en el arreglo personalizado.
                    }

                    const specialCount = /[-!@#$%^&*()_=+]/g.test(value);//En este caso estamos usando el .test() ya que devuelve un booleano si encuentra al menos un caracter, 
                    // que esta dentro del arreglo personalizado,
                    return (specialCount || "Por seguridad, la contraseña debe incluir al menos uno de estos caracteres -!@#$%^&*()_=+");
                    //Si no esta dentro del arreglo de los caracter, retornamos un return con el mensaje.
                  },
                  //Valida que contenga al menos una letra mayscula
                  hasUppercase: (value: string) =>
                    /[A-Z]/.test(value) || "La contraseña debe contener al menos una letra mayúscula.",
                },

              })}
            />
            <span className="input.group.text" style={{ cursor: "pointer" }} onClick={() => setShowPassword(prev => !prev)}>
              <i className={`bi ${showPassword ? "bi-eye" : "bi-eye-slash"}`}></i>
            </span>
            {errors.contrasena && (<ErrorMessage>{errors.contrasena.message}</ErrorMessage>)}
          </div>


          {/* validacion en la contraseña */}
          <div className="mb-3">
            <label htmlFor="confirmaContra" className="form-label"> Confirme la nueva contraseña</label>
            <input type={showConfirmPassword ? "text" : "password"} className="form-control" placeholder="Repita su nueva contraseña"
              {...register("confirmaContra", {
                required: "Es necesario que repita la contraseña",
                minLength: { value: 8, message: "La contraseña debe contener al menos 8 caracteres.", },
                maxLength: { value: 50, message: "La contraseña no debe superar los 50 caracteres.", },
                validate: (value) => value === password || "Las contraseñas no coinciden.",
              })}
            />
            <span className="input.group.text" style={{ cursor: "pointer" }} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              <i className={`bi ${showConfirmPassword ? "bi-eye" : "bi-eye-slash"}`}></i>
            </span>
            {errors.confirmaContra && (<ErrorMessage>{errors.confirmaContra.message}</ErrorMessage>)}


          </div>


          {/* BOTÓN ENVIAR: requiere both email válido e reCAPTCHA */}
          <button type="submit" className="btn-contraseña mb-3">
            {isChngPwd ? 'Restableciendo...' : 'Restablecer Contraseña'}
          </button>
        </form>
        {/*Ventana modal para poder avisar que todo esta perfecto*/}
        <Modal isVisible={showModalDatos} title="Exito" message="La contraseña se actualizo correctamente."
          iconSrc="img/procesado.svg" iconAlt="Icono de exito" closeButtonLabel="Aceptar" onClose={() => navegacionLogin()} />

      </div>

      {Modals}
    </div>



  );
};

export default RestablecerContrasena;
