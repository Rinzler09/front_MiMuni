import React, { useState } from 'react';//estamos utilizando el hook useState para manejar los estados de los iconos de los de visualizacion
import '../../../style/UserInfoStyles/ResetPwdSession.css';//Estilo para el componente de RestablecerContraseñaSesion.tsx
import { useForm } from 'react-hook-form';//Libreria para validar los campos del formulario
import ErrorMessage from '../../ErrorMessage/MostrarMensajesError'; //Importacion del componenete que viene el mensaje del error
import { resetPwdSessionService } from '../../../services/RstPwdSessionService'; //Servicio para enviar la solicitud de cambio de contraseña
import type { resetPwdSession } from '../../../types/generalForm'//Importancion del type para el manejo de los datos del formulario
import { Toaster, toast } from "sonner";
import { useAuth } from '../../../Auth/AuthContext';
import Modal from '../../shared/ModalComponents/modalComponent';
import { useNavigate } from 'react-router-dom';
import { logoutUsuario } from '../../../services/EliminacionCookie';


const ResetPwdSession: React.FC = () => {
  const navigate = useNavigate();
  const { token, setUser, setToken, setSelectedMunicipality } = useAuth();
  const [showCurrent, setShowCurrent] = useState(true);//constante para manejar la visibilidad de la contraseña anterior mendiante del hook useState
  const [showNew, setShowNew] = useState(true);// constante para manejar la visibilidad de la contraseña actual mendiante del hook useState
  const [showConfirm, setShowConfirm] = useState(true);//constante para manejar la visibilidad de la contraseña confirmacion mendiante del hook useState
  const [isChngPwdSS, setIsChngPwdSS] = useState(false);
  const [showModalDatos, setShowModalDatos] = useState<boolean>(false);

  //Funcion para poder cambiar la pagina al login
  const handleLogout = async () => {
    try {
      await logoutUsuario(token as string);
    } catch (err) {
      console.error("Error al hacer logout:", err);
    } finally {
      console.log("Entro a handleLogOut")
      setUser(null);
      setToken(null);
      setSelectedMunicipality(null);
      // handleExpire(); me genera problemas porque carga dos veces el useSessionTimeOut en la misma pantalla que es General.tsx
      navigate("/");//navigate si esta funcionando aqui no es necesario el .reload(), probablemente por el finally
    }
  };

  // Validaciones de los campos del formulario
  //iniitialValues es utilizado para validar valores iniciales como los campos del formulario,
  //en este caso lo que viene de type en generalForm.ts con los objetos de cambioContraseña.
  const initialValues: resetPwdSession = { contrasenaAnterior: "", contrasena: "", confirmaContra: "", };


  //el register permite en poder registrar los campos para poder validarlos
  //el formState es para manejar estados personalizados como en este caso l|os errores de los campos
  //El handleSubmit realiza la tarea de enviar la informacion de los formulario al backend.
  const { register, watch, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues });//En este caso estamos usando el hook useForm para poder manejar la valides de los campos del formulario

  /*Esta funcion de handleResetContrasenaSession se hace responsable del evento para ejecutar el cambio de contraseña
  El formData es todo el objeto que tiene del formulario para enviarle al backend para hacer la,
  Validaacion en la peticion en lo que viene el objeto de cambioContraseña de generalForm.ts que es donde se define los type
  */

  const password = watch("contrasena"); //Se utiliza para validar que el campo de contrasena nueva y el de repetir contrasena nueva sean iguales
  const handleResetContrasenaSession = async (formData: resetPwdSession) => {
    console.log("Envío de datos para RstPwdSession al backend", formData);
    setIsChngPwdSS(true);
    try {
      //Response es una funcion en donde envia una peticion al backend para cambiar la contraseña 
      //en esta funcion en via una promesa y retorna con una respuesta 
      const response: any = await resetPwdSessionService(formData.contrasenaAnterior, formData.contrasena, formData.confirmaContra, token as string);
      if (response.status === 200) {
        setTimeout(() => setShowModalDatos(true), 500);
      } else {
        toast.error("No se pudo actualizar la contraseña");
      }
      console.log("La respuesta en restablecerContraSesion.tsx: ", response);

    } catch (error: any) {
      toast.error(error?.message ?? "Error al actualizar la contraseña, Intente nuevamente");
    } finally {
      setIsChngPwdSS(false);
    }
  };

  //Documentacion 
  return (
    //password-change-container es una clase personalizada que viene de style/UserInfoStyles/CambioContraseña.css
    //La clase mx-auto viene de Boostrap para centralizar el contenido dentro.
    /*
    El my-1 es una clase de Boostrap que aplica un margen vertical
    .my-1 su intepretacion viene catalogada como 
    margin-top: 0.25rem:
    margin-bottom: 0.25rem:
    basicamente eso equivale a un margen de 4px
    */
    <div className="password-change-container mx-auto my-2">
      <div>
        {/*
          En este caso utilizamos una etiqueta de h2 para el titulo  y tambien tenemos la etiqueta p para tener un parrafo
          Tenemos la clase text-start= esto significa que el texto estara en la posicion izquierda y mb-2 
          es viene siendo un margen de 0.5rem que eso equivale 8px.
          *mb significa margin-bottom seguido del numero  
        */}
        <h2 className="text-start mb-2">Restablecer Contraseña</h2>
        <p className="text-start mb-4">Por favor, complete los siguientes campos para actualizar su contraseña.</p>
      </div>

      {/*
       1.la etiqueta FORM es todo lo que contiene los campos del formulario que basicamente agrupa ya sea button, input
       2. El onSubmit es un manejador de eventos en donde le damos clik, al boton automaticamente se dispara lo que contiene dentro,
         que en este caso viene la funcion de (handleSubmit) basicamente hace que reciba los datos del formulario si la validacion del 
         formulario es exitoso.
      3.La funcion handleCambioContraseña se ejecuta cuando ya se haya pasado todo el filtro de la validaciones y se envia direactamente 
        y se hace la peticion al backend.
      */}
      <form onSubmit={handleSubmit(handleResetContrasenaSession)}>

        <div className="mb-3 position-relative">
          {/**Tenemos la clase de mb-3 position-relative
         1.El mb-3 esta catalogado como margen-bottom: 1rem que eso equivale un espacio abajo de 16px
        2. Position-relative, hace que la posicion sea estable y tenga un 
        */}
          <div className="mb-3 position-relative">
            <input type={showCurrent ? 'password' : 'text'} className=" form-control" placeholder="Ingrese su actual contraseña"
              {...register("contrasenaAnterior", {
                required: "Es necesario que digite la contraseña actual",
                minLength: { value: 8, message: "La contraseña debe contener al menos 8 caracteres.", },
                maxLength: { value: 50, message: "La contraseña no debe superar los 50 caracteres.", },
                validate: {
                  //Valida que contenga al menos digito(acepto mas)
                  hasAtLeastOneDigit: (value: string) => {//La funcion de hasAtLeastOneDigit es donde recibe el valor del campo para validar
                    const digitCount = /\d/g.test(value);//este arreglo en donde devuelve string en donde si no encuentra un caracter
                    //evuelve null como vacio, ya que el operador logico 
                    return (digitCount || "La contraseña debe contener al menos un numero.");// Retorna en la parte de digitCount que nos dice 
                    // que puedes ser mayor o igual a 1 eso nos habla que podemos poner mas numero sin ninguna restrigion 
                  },
                  //Valida que contenga Existente un caracter especial
                  hasOneSpecial: (value: string) => {
                    if (/[^\w-!@#$%^&*()_=+]/.test(value)) {
                      return "La contraseña solo puede contener estos caracteres especiales -!@#$%^&*()_=+";
                    }
                    const specialCount = /[-!@#$%^&*()_=+]/.test(value);//tene declarada el specialCount donde tiene el arreglo
                    //en done valida los caractares especiales personalizado y tambien a su vez valida si no viene ningun vacio.
                    //En este caso tuve que cambiar de posicion el carecter guion porque me afectaba en la validacion de la contraseña 
                    //Estamos agregando 
                    return (specialCount || "Por seguridad, la contraseña debe incluir al menos uno de estos caracteres -!@#$%^&*()_=+");
                    // En esta parte del codigo
                    //es fundamente porque valida la longitud del array ya que compara si specialCount >= 1 queriendo decir que podemos agregar mas caracteres,
                    //pero si no encuentra ninguno se activara el mensaje 
                  },
                  //Valida que contenga al menos una letra mayscula ya que puede ser aceptada una o mas letra en mayuscula.
                  hasUppercase: (value: string) =>
                    /[A-Z]/.test(value) || "La contraseña debe contener al menos una letra mayúscula.",
                }

              })} />{/*
            1.En la etiqueta input tenemos una clase de form-control form-control-lg, en donde hace referencia que ocupa el 100% de ancho
              en la parte de form-control se utiliza para poder darle una forma mas agregada en el punto que apargue en el espacio
            2.El showCurrent, es un tipo booleano que se utiliza para el estado del hook useState que valida cuando desea ver la contraseña o no,
            en esta comparacion {showCurrent ? 'password'} si es true se le asigna al input el tipo password y si es false visualiza en texto plano el value del input
            3.El placeholder es un descriptivo de mensaje que le avisa al usuario que poner en el campo.
            4.El metodo register sirve para validar todo elemento de entrada que aplica reglas de validacion.
            5.Dentro de register tenemos como argumento contraseñaAnterior, que basicamente viene callback para poder compararlo
            6.El required hace que la regla de validacion se dispare cuando el usuario no ingresa un valor
            7. minLength obliga a que el valor tenga al menos 8 carecteres y el maxLength = hace que tenga un limite de no superar 50 caracteres
          */}





            <button //En este caso se utiliza la etiqueta button para tener un mayor control interactivo 
              type="button" //se utiliza el type=button para evitar el comportamiento de submit. 
              className="password-toggle" // En esta ocacion estamos utilizando una clase personalizada que viene desde cambioContraseña.css
              onClick={() => setShowCurrent(!showCurrent)}// es un evento donde se ejecuta al momento de darle click, funciona para que pueda
              //habilitar el icono de mostrar contraseña, esto hace que se ejecute el hook que esta declarado en useState(true) que eso quiere,
              //Decir que es verdadero
              aria-label={showCurrent ? "Ocultar contraseña" : "Mostrar contraseña"}>
              <i className={`fas fa-eye${showCurrent ? "-slash" : ""}`}></i>

            </button>

          </div>
          {/** //arial-label hace como referencia, el texto
            //como mostrar contraseña o Ocultar contraseña
            // estamos usando la etiqueta i que se agregar el icono fas fa-eye
            //tenemos es cambiar el icono cuando showCurrent esta en true añade el slash y cuando esta en false queda perdetermiado al que estaba*/}

          {errors.contrasenaAnterior && <ErrorMessage>{errors.contrasenaAnterior.message} </ErrorMessage>}{/**
             1. este linea de codigo tenemos una condicion de mensaje de error que estan relacioando con los campos 
             * ContraseñaAnterior, es decir que si el usuario no ingrese nada en el inpunt o introduce algo que no es permitido,
             * automaticamente activara la condicion.
             2.El ErrorMessage viene de un componente que es reutilizable y que se llama MostrarMensajeError.tsx,
             dentro de ese componente se renderiza el errors.contrasenaAnterior.message, el(message) viene de las reglas de validacion
             que tenemos dentro de register, y eso se mostraria al contribuyente.
             3.este componente se visualiza en la parte inferior del input cuando hay discrepancias con las validaciones
             */}

        </div>


        {/** Input Contraseña Nueva */}
        <div className="mb-3 position-relative">
          <div className="mb-3 position-relative">
            <input type={showNew ? 'password' : 'text'} className="form-control " placeholder="Ingrese su nueva contraseña"
              {...register("contrasena", {
                required: "Es necesario que digite la nueva contraseña",
                minLength: { value: 8, message: "La nueva contraseña debe contener al menos 8 caracteres.", },
                maxLength: { value: 50, message: "La nueva contraseña no debe superar los 50 caracteres.", },
                validate: {// Es una regla que se puede personalidad en distinta condiciones

                  hasAtLeastOneDigit: (value: string) => { //La funcion de hasAtLeastOneDigit es donde recibe el valor del campo para validar
                    const digitCount = /\d/g.test(value);// este arreglo en donde devuelve string en donde si no encuentra un caracter
                    // devuelve null como vacio, ya que el operador logico 
                    return (digitCount || "La contraseña debe contener al menos un numero."); // Retorna en la parte de digitCount que nos dice 
                    // que puedes ser mayor o igual a 1 eso nos habla que podemos poner mas numero sin ninguna restrigion 
                  },
                  //Valida que contenga Existente un caracter especial
                  hasOneSpecial: (value: string) => {// La funcion nos valida si no hay campos vacios ya que se personaliza en distintas parte
                    if (/[^\w-!@#$%^&*()_=+]/.test(value)) {
                      return "La contraseña solo puede contener estos caracteres especiales -!@#$%^&*()_=+";
                    }

                    const specialCount = /[-!@#$%^&*()_=+]/g.test(value)//tene declarada el specialCount donde tiene el arreglo
                    //en done valida los caractares especiales personalizado y tambien a su vez valida si no viene ningun vacio.
                    return (specialCount || "Por seguridad, la contraseña debe incluir al menos uno de estos caracteres -!@#$%^&*()_=+");// En esta parte del codigo
                    //es fundamente porque valida la longitud del array ya que compara si specialCount >= 1 queriendo decir que podemos agregar mas caracteres,
                    //En este caso tuve que cambiar de posicion el carecter guion porque me afectaba en la validacion de la contraseña
                    //pero si no encuentra ninguno se activara el mensaje 
                  },
                  //Valida que contenga al menos una letra mayscula ya que puede ser aceptada una o mas letra en mayuscula.
                  hasUppercase: (value: string) =>
                    /[A-Z]/.test(value) || "La contraseña debe contener al menos una letra mayúscula.",
                },
              })} />


            <button type='button' className="password-toggle" onClick={() => setShowNew(!showNew)}>
              <i className={`fas fa-eye${showNew ? '-slash' : ''}`}></i>
            </button>
          </div>

          {errors.contrasena && <ErrorMessage>{errors.contrasena.message} </ErrorMessage>}
        </div>

        {/** Input Confirmar Contraseña */}
        <div className="mb-3 position-relative">
          <div className="mb-3 position-relative">
            <input type={showConfirm ? 'password' : 'text'} className="form-control " placeholder="Repita la nueva contraseña"
              {...register("confirmaContra", {
                required: "Es necesario que confirme la nueva contraseña",
                minLength: { value: 8, message: "La nueva contraseña debe contener al menos 8 caracteres.", },
                maxLength: { value: 50, message: "La nueva contraseña no debe superar los 50 caracteres.", },
                validate: {
                  isSamePwd: (value: string) => {
                    return value === password || "Las contraseñas no coinciden."
                  },
                  //Valida que contenga al menos digito(acepto mas)
                  hasAtLeastOneDigit: (value: string) => {//La funcion de hasAtLeastOneDigit es donde recibe el valor del campo para validar
                    const digitCount = /\d/g.test(value);//este arreglo en donde devuelve string en donde si no encuentra un caracter
                    //evuelve null como vacio, ya que el operador logico 
                    return (digitCount || "La contraseña debe contener al menos un numero.");// Retorna en la parte de digitCount que nos dice 
                    // que puedes ser mayor o igual a 1 eso nos habla que podemos poner mas numero sin ninguna restrigion 
                  },
                  //Valida que contenga Existente un caracter especial
                  hasOneSpecial: (value: string) => {
                    if (/[^\w-!@#$%^&*()_=+]/.test(value)) {
                      return "La contraseña solo puede contener estos caracteres especiales -!@#$%^&*()_=+";
                    }

                    const specialCount = /[-!@#$%^&*()_=+]/g.test(value);//tene declarada el specialCount donde tiene el arreglo
                    //en done valida los caractares especiales personalizado y tambien a su vez valida si no viene ningun vacio.
                    return (specialCount || "Por seguridad, la contraseña debe incluir al menos uno de estos caracteres -!@#$%^&*()_=+");
                    // En esta parte del codigo
                    //es fundamente porque valida la longitud del array ya que compara si specialCount >= 1 queriendo decir que podemos agregar mas caracteres,
                    //En este caso tuve que cambiar de posicion el carecter guion porque me afectaba en la validacion de la contraseña
                    //pero si no encuentra ninguno se activara el mensaje 
                  },
                  //Valida que contenga al menos una letra mayscula ya que puede ser aceptada una o mas letra en mayuscula.
                  hasUppercase: (value: string) =>
                    /[A-Z]/.test(value) || "La contraseña debe contener al menos una letra mayúscula.",
                },
              })} />


            <button type='button' className="password-toggle" onClick={() => setShowConfirm(!showConfirm)}>
              <i className={`fas fa-eye${showConfirm ? '-slash' : ''}`}></i>
            </button>
          </div>

          {errors.confirmaContra && <ErrorMessage>{errors.confirmaContra.message} </ErrorMessage>}
        </div>

        {/** Botón cambiar */}
        <button type="submit" className="button  mb-3">
          {isChngPwdSS ? 'Restableciendo...' : 'Restablecer'}
        </button>
      </form>
      {/*Ventana modal para poder avisar que todo esta perfecto*/}
      <Modal isVisible={showModalDatos} title="Exito" message="La contraseña se actualizo correctamente. Por seguridad inicia sesion con tus nuevas credenciales."
        iconSrc="img/procesado.svg" iconAlt="Icono de exito" closeButtonLabel="Aceptar" onClose={() => handleLogout()} />

    </div>
  );
};

export default ResetPwdSession;
