// src/Pages/CambioContraseña.tsx
import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../style/PagesStyles/cambioContraseñaStyles.css";

import type { verificacion, codigoVerificacion } from "../../types/generalForm";
import { useForm } from "react-hook-form";
import ReCAPTCHA from "react-google-recaptcha";

import {correoRecuperacionContrasenia, verificacioCodigoServices,} from "../../services/EnvioCorreoElectronicoServices";
import Modal from "../../Components/attributeComponents/ModalComponents/modalComponent";
import { mensajes } from "../../util/message";
import { Toaster, toast } from "sonner";

const RecuperarContraseña: React.FC = () => {
  const navigate = useNavigate();
  const RECAPTCHA_KEY = "6LfhvTErAAAAAMf6tWN5DlCFbZcIljmrLErok5yW";

  // Estados UI
  const [isRecaptchaVerified, setIsRecaptchaVerified] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [isSending, setIsSending] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [codeBlocked, setCodeBlocked] = useState(false);
  const [blockCountdown, setBlockCountdown] = useState(0);
  const emailRef = useRef<string>("");

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
    console.log("reCAPTCHA verificado:", _token);
  };

  // Countdown para desbloquear OTP tras bloqueo
  useEffect(() => {
    if (!codeBlocked) return;
    const timer = setInterval(() => { setBlockCountdown(c => {
        if (c <= 1) {
          clearInterval(timer);
          setCodeBlocked(false);
          setAttemptCount(0);
          resetField('otp');
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [codeBlocked, resetField]);

  // Enviar email
  const onSendEmail = async (data: verificacion) => {
    setIsSending(true);
    try {
      const resp = await correoRecuperacionContrasenia(data.email);
      if (resp?.success ?? true) {
        emailRef.current = data.email;
        setStep('otp');
        setShowModal(true);
      } else {
        throw new Error(resp.message || 'Error al enviar');
      }
    } catch (e: any) {
      toast.error(e.message || 'No se pudo enviar el correo.');
    } finally {
      setIsSending(false);
    }
  };

  // Validar OTP
  const onValidateOtp = async (data: codigoVerificacion) => {
    if (codeBlocked) {
      toast.error(`Intentos agotados. Espera ${blockCountdown}s.`);
      return;
    }
    try {
      const resp = await verificacioCodigoServices(emailRef.current, data.otp);
      if (resp?.success ?? true) {
        navigate('/restablecer-contraseña', {state: {enviado:true}});
      } else {
        throw new Error(resp.message);
      }
    } catch {
      const next = attemptCount + 1;
      setAttemptCount(next);
      toast.error(mensajes['El codigo no es correcto, ingrese el codigo correcto']?.mensaje || 'Código inválido, ingrese el correcto');
      if (next >= 3) {
        setCodeBlocked(true);
        setBlockCountdown(120);
      }
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
                  {...register('email', {required: 'El email es obligatorio', pattern: { value: /\S+@\S+\.\S+/, message: 'Formato inválido' },})}/>
                <label htmlFor="email">Correo electrónico</label>
                {errors.email && ( <div className="text-danger mt-1">{errors.email.message}</div>)}
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
              <p className="lead-text mb-3 text-center" style={{textAlign: "left"}}>
                Ingresa el código temporal enviado a tu correo electrónico.
                Revisa tu bandeja de entrada y spam, si no vuelva enviar el correo electronico.
              </p>

              <form onSubmit={handleSubmit(onValidateOtp)}>
                <div className="mb-3">
                  <label htmlFor="otp" className="form-label"> Código temporal</label>
                  <div className="input-group">
                    <input type="text" id="otp" className="form-control form-control-xl" placeholder="000000" disabled={codeBlocked}
                      {...register('otp', { required: 'El código es obligatorio' })}/>
                    <button type="submit" className="btn btn-xl" style={orange} disabled={codeBlocked}>
                      {codeBlocked ? `Bloqueado ${blockCountdown}s` : 'Validar'}
                    </button>
                  </div>
                  {errors.otp && ( <div className="text-danger mt-1">{errors.otp.message}</div>)}
                </div>

                <div className="d-grid gap-2">
                  <button type="button" className="btn btn-xl" style={orangeOutline}
                    onClick={() => {setStep('email'); setAttemptCount(0); setCodeBlocked(false); reset(); setIsRecaptchaVerified(false);}}>
                    Volver a enviar correo
                  </button>
                </div>
              </form>
            </>
          )}

        </div>
      </div>

      <Modal isVisible={showModal} title="Correo Enviado" message="El correo ha sido enviado. Revisa tu bandeja de entrada y spam." iconSrc="img/email.png"
        iconAlt="Icono de email" closeButtonLabel="Aceptar" onClose={() => setShowModal(false)}/>
    </div>
  );
};

export default RecuperarContraseña;