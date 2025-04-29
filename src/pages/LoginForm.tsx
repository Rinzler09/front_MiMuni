import React, { useState, useEffect } from "react";
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
  const { setUser } = useAuth();

  // Configuración de react-hook-form con maxLength en validación
  const initialValues: confirmacionLogin = { email: "", contra: "" };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues,
  });

  // Mostramos errores de formulario en toast
  useEffect(() => {
    if (errors.email) toast.error(errors.email.message);
    if (errors.contra) toast.error(errors.contra.message);
  }, [errors.email, errors.contra]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación extra de longitudes
    if (email.length >= 50) {
      toast.error("El email no puede exceder 50 caracteres.");
      return;
    }
    if (password.length < 8 || password.length > 50) {
      toast.error(
        "La contraseña debe tener entre 8 y 50 caracteres, incluyendo una letra mayúscula, un número y un símbolo especial."
      );
      return;
    }

    if(password.length >= 50){
      toast.error("La contraseña no puede exceder 50 caracteres.");
      return;
    }

    const regexNumero: RegExp = /\d/;
    const regexSimbolo: RegExp = /[!@#$%^&*(),.?":{}|<>]/;
    if (!regexNumero.test(password) || !regexSimbolo.test(password)) {
      toast.error(
        "La contraseña debe incluir al menos un número y un símbolo especial."
      );
      return;
    }

    if (isSubmitting || hasLoggedIn) return;
    setIsSubmitting(true);

    try {
      const data = await login(email, password);
      if (data.message.toLowerCase().includes("credenciales incorrectas")) {
        setIsSubmitting(false);
        return;
      }

      let municipalidadesArray: string[] = [];
      if (Array.isArray(data.municipalidades)) {
        municipalidadesArray = data.municipalidades;
      } else if (typeof data.municipalidades === "string") {
        municipalidadesArray = data.municipalidades.split(",");
      }

      if (data.isTemporaryPassword) {
        setUser({
          email: data.correo,
          token: data.access_token || "",
          municipalidades: municipalidadesArray,
        });

        sessionStorage.setItem("email", email);
        sessionStorage.setItem("password", password);

        setTimeout(() => {
          navigate("/cambio-contraseña");
        }, 2000);
        return;
      }

      if (data.success) {
        setUser({
          email: data.correo,
          token: data.access_token || "",
          municipalidades: municipalidadesArray,
        });
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

      <div className="container min-vh-100 d-flex justify-content-center align-items-center">
        <div
          className="card login-wrapper w-100"
          style={{ maxWidth: "800px", borderRadius: "20px", overflow: "hidden" }}
        >
          <div className="row g-0">
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

            <div className="col-12 col-md-7 p-4 d-flex flex-column justify-content-center align-items-center">
              <h2 className="titu">LOGIN</h2>
              <form onSubmit={handleLogin} className="w-100">
                {/* Email */}
                <div className="mb-3 input-group">
                  <span className="input-group-text">👤</span>
                  <input
                    type="text"
                    id="email"
                    className="form-control"
                    placeholder="Ingrese su email"
                    required
                    title="Campo obligatorio"
                    maxLength={50}
                    {...register("email", {
                      required: "Email obligatorio.",
                      maxLength: { value: 50, message: "No puede exceder 50 caracteres." },
                      pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Email electrónico inválido.",
                      },
                    })}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
                </div>

                {/* Contraseña */}
                <div className="mb-3 input-group">
                  <span className="input-group-text">🔒</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    placeholder="Ingrese su password"
                    required
                    maxLength={50}
                    {...register("contra", {
                      required: "Password obligatoria.",
                      maxLength: {
                        value: 50,
                        message: "No puede exceder 50 caracteres.",
                      },
                    })}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={(e) => setPassword(e.target.value.trim())}
                  />
                  <span
                    className="input-group-text"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={`bi ${showPassword ? "bi-eye" : "bi-eye-slash"}`}></i>
                  </span>
                  {errors.contra && <ErrorMessage>{errors.contra.message}</ErrorMessage>}
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
                  <button className="login-btns" type="button" onClick={handleRegister}>
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
