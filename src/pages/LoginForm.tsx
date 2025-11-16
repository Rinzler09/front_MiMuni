// LoginForm.tsx
import React, { useState, useEffect } from "react";
import { Suspense } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../style/PagesStyles/loginFormStyles.css";
import { login } from "../services/loginFormServices";
import { Toaster, toast } from "sonner";

// Manejo de errores con react-hook-form
import ErrorMessage from "../Components/ErrorMessage/MostrarMensajesError";
import { useForm } from "react-hook-form";
import type { confirmacionLogin } from "../types/generalForm";

// AuthContext para almacenar datos de usuario
import { useAuth } from "../Auth/AuthContext";


// Iconos
import { FaRegUser } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";

// Imágenes del carrusel
import slide1 from "../../public/img/muni.png";
import slide2 from "../../public/img/muni.png";
import slide3 from "../../public/img/muni.png";

const slides = [
  { image: slide1, description: "Bienvenido, estamos en compromiso y servicio a la comunidad." },

  { image: slide2, description: " Bienvenido, estamos cerca de ti, al servicio de toda la comunidad." },

  { image: slide3, description: "Bienvenido, su voz, nuestra guía, tu bienestar, nuestra meta." },
];

const LoginForm: React.FC = () => {
  // Estados del formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Carrusel
  const [currentSlide, setCurrentSlide] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  //Verificacion de token
  const navigate = useNavigate();
  const { setUser, setToken, setTokenOT } = useAuth();

  // React Hook Form
  const {
    register,
    formState: { errors }
  } = useForm<confirmacionLogin>({ defaultValues: { email: "", contra: "" } });

  // Muestra errores de validación
  useEffect(() => {
    if (errors.email) toast.error(errors.email.message);
    if (errors.contra) toast.error(errors.contra.message);
  }, [errors.email, errors.contra]);

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailLowCase = email.toLocaleLowerCase();
    // Validaciones extra
    if (email.length > 50) {
      toast.error("El email no puede exceder 50 caracteres.");
      return;
    }
    if (password.length < 8 || password.length > 50) {
      toast.error("La contraseña debe tener entre 8 y 50 caracteres, incluyendo una letra mayúscula, un número y un símbolo especial.");
      return;
    }
    const regexNumero = /\d/; //regexNumero debe contener un digito entre 0-9
    const regexSimbolo = /[!@#$%^&*()-_=+]/; //estos caracteres son los que GR usa para emitir la temp pwd
    // lo que se puede hacer es que a la hora de reestablecer y cambiar por primera vez la contra
    // que solo estos caracteres especiales esten disponibles.
    //En el input textfield se debe mostrar que otros caracteres no son validos
    if (!regexNumero.test(password) || !regexSimbolo.test(password)) {
      toast.error("La contraseña debe incluir al menos un número y un símbolo especial.");
      return;
    } //si no cumple con los parametros anteriores entonces lanza un toast de error


    if (isSubmitting) return; //cambia el boton de iniciando sesion para que aparezca
    setIsSubmitting(true); //  como que esta cargando, tambien se puede implementar un loading

    try {
      const data = await login(emailLowCase, password);
      console.log("Resultado del login:", data);
      console.log("el correo, ", emailLowCase);

      if (data.message.toLowerCase().includes("credenciales incorrectas")) {
        setIsSubmitting(false);// innecesario por los momentos
        return;
      }

      // Procesar municipalidades
      let municipalidadesArray: string[] = [];
      const rawMunicipios = data.municipalidades as string | string[] | undefined;
      if (Array.isArray(rawMunicipios)) {
        municipalidadesArray = rawMunicipios;
      } else if (typeof rawMunicipios === "string") {
        municipalidadesArray = rawMunicipios.split(",");
      }

      // Si es contraseña temporal…
      if (data.isTemporaryPassword) {
        const tokenValue = data.access_token || "";
        setTokenOT(tokenValue);
        sessionStorage.setItem("email", emailLowCase); //se guarda en SessionStorage para el cambio de contraseña inicial
        sessionStorage.setItem("password", password);//se guarda en SessionStorage para el cambio de contraseña inicial
        setTimeout(() => navigate("/cambio-contrasena"), 2000);
        return;
      }

      // Si se recibe success: true desde el service entonces se ejecuta este bloque de codigo
      if (data.success) {
        const tokenValue = data.access_token || "";
        setUser({ email: data.correo, /*token: tokenValue,*/ municipalidades: municipalidadesArray, });
        setToken(tokenValue);
        // setSessionCounter(sessionCounter + 1);
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
    navigate("/registrar-usuario", { state: { enviado: true } });
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/enviar-codigo");
  };

  return (

    <Suspense fallback={<div>Cargando Login ...</div>}>


      <div className="background">
        {/**En esta parte se agrego el cambio de la posicion superior y el tipo del color de los toast*/}
        <Toaster closeButton position="top-right" richColors />
        <div className="circle circle1"></div>{/*Estos circulos son para el efecto de foco detras del Login Form*/}
        <div className="circle circle2"></div>
        <div className="circle circle3"></div>


        <div className="container min-vh-100 d-flex justify-content-center align-items-center">
          {/* Aquí sólo cambio la clase del wrapper */}
          <div className="login-wrapper">
            {/* <div className="row g-0"> se comento para intentar solucionar el error de los bordes en el login despues de cerrar sesion*/}

            {/* Panel izquierdo: carrusel */}
            <div className="col-md-5 d-none d-md-flex flex-column">
              <h2 className="titu">Mi Muni en Línea</h2>
              <div className="carousel-content">
                <img src={slides[currentSlide].image} alt={slides[currentSlide].description} className="illustration" />
                <p className="slide-description">
                  {slides[currentSlide].description}
                </p>

              </div>
              <div className="slide-titles">
                {slides.map((_, idx) => (
                  <span key={idx} className={`slide-title ${idx === currentSlide ? "active" : ""}`}
                    onClick={() => setCurrentSlide(idx)} />
                ))}
              </div>

              <img alt="LogoBancoAtlantida"
                src="../../../public/img/LogocompletoBALinea.png"
                style={{
                  width: "220px",
                  margin: "auto",
                  marginTop: "40px"
                }} />
            </div>

            {/* Panel derecho: formulario */}
            <div className="col-12 col-md-7 d-flex flex-column justify-content-center align-items-start">
              {/* <h2 className="titu">Mi Muni en Línea</h2> */}
              <span>
                Actíva y accede a todos los servicios en línea que tu municipalidad pone a tu disposición.{" "}
                <a href="#" className="forgot-password" onClick={handleRegister}>
                  Activar Ahora
                </a>
              </span>

              <form onSubmit={handleLogin} className="w-100">
                {/* Email */}
                <div className="input-group">
                  <span className="input-group-text">
                    <FaRegUser size={20} />
                  </span>
                  <input type="text" className="form-control" placeholder="Ingrese su correo electronico" required maxLength={50}
                    {...register("email", {
                      required: "Email obligatorio.", maxLength: { value: 50, message: "No puede exceder 50 caracteres." },
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Email inválido.", },
                    })}
                    value={email} onChange={e => setEmail(e.target.value)} />
                  {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
                </div>

                {/* Contraseña */}
                <div className="input-group">
                  <span className="input-group-text">
                    <RiLockPasswordLine size={20} />
                  </span>
                  <input type={showPassword ? "text" : "password"} className="form-control" placeholder="Ingrese su contraseña" required maxLength={50}
                    {...register("contra", {
                      required: "Contraseña obligatoria.", maxLength: { value: 50, message: "No puede exceder 50 caracteres." },
                    })} value={password} onChange={e => setPassword(e.target.value)} onBlur={e => setPassword(e.target.value.trim())} />
                  <span className="input-group-text" onClick={() => setShowPassword(!showPassword)} >
                    <i className={`bi ${showPassword ? "bi-eye" : "bi-eye-slash"}`}></i>
                  </span>
                  {errors.contra && <ErrorMessage>{errors.contra.message}</ErrorMessage>}
                </div>

                {/* Recordar credenciales 
                <div className="form-check mb-3">
                  <input type="checkbox" className="form-check-input" id="remember" />
                  <label htmlFor="remember" className="form-check-label">
                    Recordar credenciales
                  </label>
                </div>*/}

                {/* Olvidó contraseña */}
                <a href="#" className="forgot-password mb-3" onClick={handleForgotPassword}>
                  ¿Olvidó su contraseña?
                </a>

                {/* Botón Iniciar sesión */}
                <button type="submit" className="login-btn" disabled={isSubmitting}>
                  {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
                </button>
              </form>
              <div style={{
                display: "flex",
                flexDirection: "row",
                width: "280px",
                margin: "70px auto -40px auto"
              }}>
                <span style={{
                  margin: "10px 10px 0 0"
                }}>Powered by</span>
                <img
                  style={{
                    width: "160px",
                  }}
                  alt="LogoGeoRedes"
                  src="../../../public/img/LetrasGeoRedes.png"
                />
              </div>

            </div>

            {/* </div> */}
          </div>
        </div>
      </div>
    </Suspense>

  );
};

export default LoginForm;
