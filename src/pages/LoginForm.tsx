import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css"; // Asegúrate de haber instalado bootstrap-icons
import "../style/PagesStyles/loginFormStyles.css";
import { login } from "../services/loginFormServices";
import { Toaster, toast } from "sonner";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseña

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      localStorage.setItem('access_token', data.auth_token);
      localStorage.setItem('user', data.correo);

      if (data.success) {
        if (data.isTemporaryPassword) {
          setTimeout(() => { navigate("/cambio-contraseña"); }, 4000);
        } else {
          setTimeout(() => { navigate("/dashboard"); }, 4000);
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Error al iniciar sesión");
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/registrar-usuario");
  };

  return (
    <div className="background">
      <Toaster position="top-right" />
      <div className="circle circle1"></div>
      <div className="circle circle2"></div>
      <div className="circle circle3"></div>

      {/* Contenedor que ocupa la altura completa de la pantalla */}
      <div className="container min-vh-100 d-flex justify-content-center align-items-center">
        <div
          className="card login-wrapper w-100"
          style={{ maxWidth: "800px", borderRadius: "20px", overflow: "hidden" }}
        >
          <div className="row g-0">
            {/* Sección izquierda: solo visible en md en adelante */}
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
              <form onSubmit={handleLogin} className="w-100">
                <div className="mb-3 input-group">
                  <span className="input-group-text">👤</span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ingrese su email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3 input-group">
                  <span className="input-group-text">🔒</span>
                  <input
                    type={showPassword ? "text" : "password"} // Cambia según el estado
                    className="form-control"
                    placeholder="Ingrese su contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={(e) => setPassword(e.target.value.trim())}
                    required
                  />
                  {/* Ícono de ojo para mostrar/ocultar contraseña */}
                  <span
                    className="input-group-text"style={{ cursor: "pointer" }} onClick={() => setShowPassword(!showPassword)}>
                    <i
                      className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                    ></i>
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
                  <button type="submit" className="login-btn">
                    Iniciar sesión
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