import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../style/PagesStyles/loginFormStyles.css";
import { login } from "../services/loginFormServices";
import { Toaster, toast } from "sonner";

// Manejo de errores con react-hook-form
import ErrorMessage from "../Components/ErrorMessage.tsx/MostrarMensajesError";
import { useForm } from "react-hook-form";
import type { confirmacionLogin } from "../types/generalForm";

// AuthContext para almacenar datos de usuario (sin usar localStorage)
import { useAuth } from "../Auth/AuthContex";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasLoggedIn, setHasLoggedIn] = useState(false);

  const navigate = useNavigate();

  // Configuración de react-hook-form
  const initialValues: confirmacionLogin = { email: "", contra: "" };
  const {register,handleSubmit,
  formState: { errors },
  } = useForm({
    defaultValues: initialValues,
  });

  // Obtenemos setUser desde el AuthContext
  const { setUser } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || hasLoggedIn) return;
    setIsSubmitting(true);

    try {
      // Llamada al servicio de login
      const data = await login(email, password);
      // data = { success, message, isTemporaryPassword, correo, access_token, municipalidades }

      if (data.message.toLowerCase().includes("credenciales incorrectas")) {
        toast.error(data.message);
        setIsSubmitting(false);
        return;
      }

      // Preparamos el arreglo de municipalidades (por si viene como string o array)
      let municipalidadesArray: string[] = [];
      if (Array.isArray(data.municipalidades)) {
        municipalidadesArray = data.municipalidades;
      } else if (typeof data.municipalidades === "string") {
        municipalidadesArray = data.municipalidades.split(",");
      }

      // Si el login indica contraseña temporal
      if (data.isTemporaryPassword) {
        toast.info("Contraseña temporal correcta.");

        setUser({
          email: data.correo,  // Almacenas el correo como string
          token: data.access_token || "",
          municipalidades: municipalidadesArray,
        });

        // Guardar email y contraseña en localStorage
        localStorage.setItem("email", email);
        localStorage.setItem("password", password);

        setTimeout(() => {
          navigate("/cambio-contraseña");
        }, 2000);
        return;
      }

      // Si es un login exitoso (sin contraseña temporal)
      if (data.success) {
      //  toast.success(data.message);

        setUser({
          email: data.correo,
          token: data.access_token || "",
          municipalidades: municipalidadesArray,
        });

        // Guardar email y contraseña en localStorage
        localStorage.setItem("email", email);
        localStorage.setItem("password", password);

        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
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

  return (
    <div className="background">
      <Toaster richColors position="top-right" />
      <div className="circle circle1"></div>
      <div className="circle circle2"></div>
      <div className="circle circle3"></div>

      {/* Contenedor principal */}
      <div className="container min-vh-100 d-flex justify-content-center align-items-center">
        <div
          className="card login-wrapper w-100"
          style={{ maxWidth: "800px", borderRadius: "20px", overflow: "hidden" }}
        >
          <div className="row g-0">
            {/* Sección izquierda */}
            <div
              className="col-md-5 d-none d-md-flex flex-column justify-content-center align-items-center p-4"
              style={{ backgroundColor: "#f3ecec", borderRight: "1px solid #ddd" }}
            >
              <div className="top-image">
                <h2 className="titu">Mi Muni en Línea</h2>
              </div>
              <img
                src="src/assets/LogoGeoRedes.png"
                alt="Illustration"
                className="illustration img-fluid"
              />
            </div>

            {/* Sección derecha */}
            <div className="col-12 col-md-7 p-4 d-flex flex-column justify-content-center align-items-center">
              <h2 className="titu">LOGIN</h2>
              <label htmlFor="email" className="form-label"></label>
              <form onSubmit={handleLogin} className="w-100">
                <div className="mb-3 input-group">
                  <span className="input-group-text">👤</span>
                 
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ingrese su email"
                    {...register("email", { required: "Email obligatorio." })}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
                </div>

                <div className="mb-3 input-group">
                  <span className="input-group-text">🔒</span>
                  <label htmlFor="contra" className="form-label"></label>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    placeholder="Ingrese su password"
                    {...register("contra", { required: "Password obligatoria." })}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={(e) => setPassword(e.target.value.trim())}
                  />
                  {/* Ícono de ojo para mostrar/ocultar contraseña */}
                  <span
                    className="input-group-text"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                  </span>
                </div>

                <div className="mb-3 form-check">
                  <input type="checkbox" className="form-check-input" id="remember" />
                  <label htmlFor="remember" className="form-check-label">
                    Recordar credenciales
                  </label>
                </div>

                <div className="mb-3">
                  <a href="#" className="forgot-password">
                    ¿Olvidó su contraseña?
                  </a>
                </div>

                <div className="d-flex justify-content-around">
                  <button className="login-btns" onClick={handleRegister}>
                    Activar Cuenta
                  </button>
                  <button type="submit" className="login-btn" disabled={isSubmitting}>
                    {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
