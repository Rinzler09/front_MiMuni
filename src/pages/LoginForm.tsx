// src/pages/LoginForm.tsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../style/PagesStyles/loginFormStyles.css";
import { login } from "../services/loginFormServices";
import { Toaster, toast } from "sonner";
import ErrorMessage from "../Components/ErrorMessage.tsx/MostrarMensajesError";
import { useForm } from "react-hook-form";
import type { confirmacionLogin } from "../types/generalForm";
import { useAuth } from "../Auth/AuthContex";
import { FaRegUser } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";

import slide1 from "../../public/img/muni.png";
import slide2 from "../../public/img/muni.png";
import slide3 from "../../public/img/muni.png";

const slides = [
  { image: slide1, description: "Bienvenido, estamos en compromiso y servicio a la comunidad." },
  { image: slide2, description: "Bienvenido, estamos cerca de ti, al servicio de toda la comunidad." },
  { image: slide3, description: "Bienvenido, su voz, nuestra guía, tu bienestar, nuestra meta." },
];

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [currentSlide, setCurrentSlide] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const navigate = useNavigate();
  const { setUser, setToken } = useAuth();

  const {
    register,
    formState: { errors },
  } = useForm<confirmacionLogin>({ defaultValues: { email: "", contra: "" } });

  useEffect(() => {
    if (errors.email) toast.error(errors.email.message);
    if (errors.contra) toast.error(errors.contra.message);
  }, [errors.email, errors.contra]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // validaciones extra
    if (email.length > 50) {
      toast.error("El email no puede exceder 50 caracteres.");
      return;
    }
    if (password.length < 8 || password.length > 50) {
      toast.error("La contraseña debe tener entre 8 y 50 caracteres, incluyendo una letra mayúscula, un número y un símbolo especial.");
      return;
    }
    const regexNumero = /\d/;
    const regexSimbolo = /[-!@#$%^&*()_=+]/;
    if (!regexNumero.test(password) || !regexSimbolo.test(password)) {
      toast.error("La contraseña debe incluir al menos un número y un símbolo especial.");
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await login(email, password);

      if (data.message.toLowerCase().includes("credenciales incorrectas")) {
        setIsSubmitting(false);
        return;
      }

      // --- Procesar municipalidades ---
      // TS ya sabe que puede ser string | string[]
      const raw = data.municipalidades ?? "";
      let municipalidadesArray: string[] = [];

      if (Array.isArray(raw)) {
        municipalidadesArray = raw;
      } else {
        municipalidadesArray = raw.split(",");
      }
     

      const tokenValue = data.access_token || "";

      // En esta parte es la logica de la contraseña temporal
      if (data.isTemporaryPassword) {
        setUser({
          email: data.correo,
          temporaryPassword: password,
          municipalidades: municipalidadesArray,
        });
        setToken(tokenValue);
        setTimeout(() => navigate("/cambio-contraseña"), 2000);
        return;
      }

      // login exitoso
      if (data.success) {
        setUser({
          email: data.correo,
          municipalidades: municipalidadesArray,
        });
        setToken(tokenValue);
        setTimeout(() => navigate("/dashboard"), 3000);
      }
    } catch (err: any) {
      toast.error(err.message || "Error al iniciar sesión");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/registrar-usuario");
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/enviar-codigo");
  };

  return (
    <div className="background">
      <Toaster closeButton position="top-right" richColors />
      <div className="circle circle1" />
      <div className="circle circle2" />
      <div className="circle circle3" />

      <div className="container min-vh-100 d-flex justify-content-center align-items-center">
        <div className="login-wrapper">
          <div className="row g-0">
            {/* Carrusel */}
            <div className="col-md-5 d-none d-md-flex flex-column">
              <h2 className="titu">MiMuni en Línea</h2>
              <div className="carousel-content">
                <img
                  src={slides[currentSlide].image}
                  alt={slides[currentSlide].description}
                  className="illustration"
                />
                <p className="slide-description">{slides[currentSlide].description}</p>
              </div>
              <div className="slide-titles">
                {slides.map((_, idx) => (
                  <span
                    key={idx}
                    className={`slide-title ${idx === currentSlide ? "active" : ""}`}
                    onClick={() => setCurrentSlide(idx)}
                  />
                ))}
              </div>
            </div>

            {/* Formulario */}
            <div className="col-12 col-md-7 d-flex flex-column justify-content-center align-items-start">
              <h2 className="titu">LOGIN</h2>
              <span>
                Actíva y accede a todos los servicios en línea que tu municipalidad pone a tu
                disposición.&nbsp;
                <a href="#" className="forgot-password" onClick={handleRegister}>
                  Activar Ahora
                </a>
              </span>

              <form onSubmit={handleLogin} className="w-100">
                <div className="input-group mb-3">
                  <span className="input-group-text">
                    <FaRegUser size={20} />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Correo electrónico"
                    required
                    maxLength={50}
                    {...register("email", {
                      required: "Email obligatorio.",
                      maxLength: { value: 50, message: "No puede exceder 50 caracteres." },
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Email inválido.",
                      },
                    })}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
                </div>

                <div className="input-group mb-3">
                  <span className="input-group-text">
                    <RiLockPasswordLine size={20} />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    placeholder="Contraseña"
                    required
                    maxLength={50}
                    {...register("contra", {
                      required: "Contraseña obligatoria.",
                      maxLength: { value: 50, message: "No puede exceder 50 caracteres." },
                    })}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={(e) => setPassword(e.target.value.trim())}
                  />
                  <span className="input-group-text" onClick={() => setShowPassword(!showPassword)}>
                    <i className={`bi ${showPassword ? "bi-eye" : "bi-eye-slash"}`}></i>
                  </span>
                  {errors.contra && <ErrorMessage>{errors.contra.message}</ErrorMessage>}
                </div>

                <a href="#" className="forgot-password mb-3" onClick={handleForgotPassword}>
                  ¿Olvidó su contraseña?
                </a>

                <button type="submit" className="login-btn" disabled={isSubmitting}>
                  {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
