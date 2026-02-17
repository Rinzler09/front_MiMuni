// src/Pages/CambioContraseña.tsx
import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../style/PagesStyles/ReseteoContraseñaStyle/recuperarContrasenaStyle.css";
import type { verificacion, codigoVerificacion } from "../../types/generalForm";
import { useForm } from "react-hook-form";
import ReCAPTCHA from "react-google-recaptcha";
import ErrorMessage from "../../Components/ErrorMessage/MostrarMensajesError";
import { correoRecuperacionContrasenia, verificacioCodigoServices, } from "../../services/EnvioEmailServices";
import Modal from "../../Components/ModalComponents/modalComponent";
import { Toaster, toast } from "sonner";
import { useAuth } from "../../Auth/AuthContext";
import { RiRadarFill } from "react-icons/ri";

const RecuperarContrasena: React.FC = () => {
  const navigate = useNavigate();
  const RECAPTCHA_KEY = "6LfhvTErAAAAAMf6tWN5DlCFbZcIljmrLErok5yW";

  // Estados UI
  const [isRecaptchaVerified, setIsRecaptchaVerified] = useState(false); //hook para validar si el captcha se soluciono
  const [showModal, setShowModal] = useState(false);//hook para controlar el display de las modales 
  const [step, setStep] = useState<'email' | 'otp'>('email'); //hook para desplegar componentes ya sea el de introducir el correo o el OTP
  const [isSending, setIsSending] = useState(false);//hook para validar si la info se esta enviando email
  const [isSendingOTP, setIsSendingOTP] = useState(false);//hook para validar si la info se esta enviando email
  const [attemptCount, setAttemptCount] = useState(0); //valida cuantas veces se ha intentado consumir un endpoint
  const [codeBlocked, setCodeBlocked] = useState(false); //hook para bloquear boton para validar el OTP
  const [blockCountdown, setBlockCountdown] = useState(0); // hook para medir los segundos de bloque del OTP
  const emailRef = useRef<string>(""); //es una referencia mutable la cual almacena el email del usuario entre steps

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    resetField,
  } = useForm<verificacion & codigoVerificacion>({ mode: 'onChange' });

  // reCAPTCHA OK
  const onRecaptcha = (_token: string | null) => {
    setIsRecaptchaVerified(true);
  };

  const { setTokenOT } = useAuth();


  // Countdown para desbloquear OTP tras bloqueo
  useEffect(() => {
    // console.log("codeBlocked ", codeBlocked);
    // console.log("blockCountdown ", blockCountdown);
    // console.log("attemptCount ", attemptCount);

    if (!codeBlocked) return;//si el input del codigo no esta bloqueado entonces sale del bloque
    const timer = setInterval(() => {
      setBlockCountdown(c => {
        if (c <= 1) {
          clearInterval(timer);//detiene la funciona de callback que se inicio con setInterval
          setCodeBlocked(false);//el input del codigo deja de estar bloqueado 
          setAttemptCount(0);//el contador de intentos se resetea de 3 a 0
          resetField('otp');//elimina ultimo registro en OTP antes de que fuera bloqueado
          return 0;//el hook blockcountdown se almacena el valor de 0
        }
        return c - 1;//se le va restando 1s al timer 
      });
    }, 1000);//hace que esta funcion se ejecute cada segundo 
    return () => clearInterval(timer);
  }, [codeBlocked, resetField]);

  // Enviar email
  const onSendEmail = async (data: verificacion) => {
    setIsSending(true);
    try {
      const resp = await correoRecuperacionContrasenia(data.email);
      if (resp?.success ?? true) {//se debe cambiar 
        emailRef.current = data.email;
        setStep('otp');
        setShowModal(true);
      } else {
        throw new Error(resp.message || 'Error al enviar');
      }
    } catch (e: any) {
      if (e.message === "ThrottlerException: Too Many Requests") {
        toast.error('Has realizado muchos intentos, espera 1 minuto para reintentar.');
      }

    } finally {
      setIsSending(false);//despues del intento de consumir el endpoint se deja de mostrar el msg de enviando
    }
  };

  // Validar OTP
  const onValidateOtp = async (data: codigoVerificacion) => {
    if (codeBlocked) {
      toast.error(`Intentos agotados. Espera ${blockCountdown}s.`);
      return;
    }
    try {
      setIsSendingOTP(true);
      const resp = await verificacioCodigoServices(emailRef.current, data.otp, setTokenOT);
      console.log("El status de la respuesta de verificacioCodigoServices: ", resp?.status);
      if (resp?.status === 200) {
        // navigate('/restablecer-contrasena');
        setTimeout(() => {
          navigate('/restablecer-contrasena');
        }, 2000); //tarda 2 segundos en navegar a restablecer-contrasena para cerciorarse de que exista el elemento access_TKN en el sessionStorage
        console.log("OTP exitoso, navegando a restablecer contrasena");

      } else {
        console.log("Hubo un error al verificar el OTP");
        throw new Error(resp.message);
      }
    } catch (e: any) {
      const next = attemptCount + 1;
      setAttemptCount(next);
      console.log("Este es el error: ", e.message);
      toast.error('Código inválido, ingrese el correcto');
      if (next >= 4) {//simboliza el numero de veces que se puede consumir el endpoint del OTP
        toast.error('Has realizado muchos intentos, espera 1 minuto para reintentar.');
        setCodeBlocked(true);
        setBlockCountdown(60);
      }
    } finally {
      setTimeout(() => setIsSendingOTP(false), 2000);//Se le agregan 2 segundos de delay ya que eso es lo que tarda en navegar a restablecer contrasena
    }
  };

  // Estilos inline para botones naranjas
  const orange = { backgroundColor: '#ff6600', borderColor: '#ff6600', color: '#fff' };
  const orangeOutline = { backgroundColor: 'transparent', borderColor: '#ff6600', color: '#ff6600' };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <Toaster position="top-right" />
      <div className="card shadow-sm reset-pass-container">
        <div className="card-body">
          {/* Título */}
          <h2 className="card-title display-6 mb-2"> Restablecer contraseña</h2>

          {/* Descripción solo en paso 'email' */}
          {step === 'email' && (
            <p className="lead-text mb-3 text-center">
              Ingresa el correo electrónico asociado a tu cuenta. Te enviaremos
              un código temporal que deberás ingresar para poder restablecer
              tu contraseña.
            </p>
          )}

          {/* Paso 1: envío de email */}
          {step === 'email' && (
            <form onSubmit={handleSubmit(onSendEmail)}>
              <div className="mb-3 form-floating">
                <input type="email" id="email" className="form-control form-control-xl" placeholder="Correo electrónico"
                  {...register('email',
                    {
                      onChange: (e) => { //al detonarse el evento on change para el email se 
                        e.target.value = e.target.value.toLowerCase(); //todo lo que se ingrese al input
                        return e; //sera transformado a minuscula y se retornara como value
                      }, required: 'El email es obligatorio', pattern: { value: /\S+@\S+\.\S+/, message: 'Formato inválido' },
                    })} />
                <label htmlFor="email">Correo electrónico</label>
                {errors.email && (<div className="text-danger mt-1">{errors.email.message}</div>)}
              </div>

              <div className="mb-4 mb-4 d-flex justify-content-end">
                <ReCAPTCHA sitekey={RECAPTCHA_KEY} onChange={onRecaptcha} />
              </div>

              <button type="submit" className="btn btn-xl w-100 mb-2" style={orange} disabled={!isValid || !isRecaptchaVerified || isSending}>
                {isSending ? 'Enviando…' : 'Enviar código'}
              </button>
            </form>
          )}

          {/* Paso 2: validación OTP */}
          {step === 'otp' && (
            <>
              {/* Descripción OTP */}
              <p className="lead-text mb-3 text-center" style={{ textAlign: "left" }}>
                Ingresa el código temporal enviado a tu correo electrónico.
                Revisa tu bandeja de entrada y spam..
              </p>

              <form onSubmit={handleSubmit(onValidateOtp)}>
                <div className="mb-3">
                  <label htmlFor="otp" className="form-label"> Código temporal</label>
                  <div className="input-group">
                    <input type="text" id="otp" className="form-control form-control-xl" placeholder="000000"
                      pattern="[0-9]+" disabled={codeBlocked} //pattern="[0-9]+" solo acepta numbers 0-9
                      maxLength={6} title="El campo debe tener 6 digitos" {...register('otp', { required: 'El código es obligatorio' })} />
                    <button type="submit" className="btn btn-xl" style={orange} disabled={codeBlocked}>
                      {!codeBlocked ? (isSendingOTP ? 'Validando...' : 'Validar') /* Si el btnValidar NO esta bloqueado y esta validando el OTP */
                        : `Espera ${blockCountdown}s` /* Si el btnValidar esta bloqueado */
                      }
                    </button>
                  </div>
                  {errors.otp && (<div className="text-danger mt-1">{errors.otp.message}</div>)}
                </div>

                <div className="d-grid gap-2">
                  <button type="button" className="btn btn-xl" style={orangeOutline}
                    onClick={() => {
                      setStep('email'); setAttemptCount(0); setCodeBlocked(false);
                      reset(); setIsRecaptchaVerified(false);
                    }} disabled={codeBlocked/*En caso de que el btnValidar este bloqueado este se bloquea tambien*/}>
                    Volver a enviar correo
                  </button>
                </div>
              </form>
            </>
          )}

        </div>
      </div>

      <Modal isVisible={showModal} title="Correo Enviado" message="El correo ha sido enviado. Revisa tu bandeja de entrada y spam." iconSrc="img/email.png"
        iconAlt="Icono de email" closeButtonLabel="Aceptar" onClose={() => setShowModal(false)} />
    </div>
  );
};

export default RecuperarContrasena;