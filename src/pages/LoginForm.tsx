import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/PagesStyles/login.css";
import { login } from "../services/services"; // Importa el servicio para el enpoint

const LoginForm: React.FC = () => {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Limpia los errores antes de intentar el login

    try {
      // Llama al servicio de login
      const data = await login(usuario, password);

      // Guarda los datos del usuario en localStorage
      localStorage.setItem("usuario", JSON.stringify(data.usuario.usuarioname));

      // Redirige al dashboard
      navigate("/dashboard");
    } catch (err: any) {
      // Maneja los errores y muestra un mensaje
      setError(err.message);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/registrar-usuario");
  };

  return (
    <div className="background">
      <div className="circle circle1"></div>
      <div className="circle circle2"></div>
      <div className="circle circle3"></div>

      <div className="login-wrapper">
        <div className="left-section">
          <div className="top-image">
            <h2 className="titu">Mi Muni en Línea</h2>
          </div>
          <img
            src="src/assets/LogoGeoRedes.png"
            alt="Illustration"
            className="illustration"
          />
          <p className="letras">
            {/* Powered by  */}
            {/* <span style={{ color: "#FF6600" }}>GeoRedes</span> */}
          </p>
        </div>

        <div className="right-section">
          <h2 className="titu">LOGIN</h2>
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <span className="icon">👤</span> {/* Icono de usuario */}
              <input
                type="text"
                placeholder="Ingrese su usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <span className="icon">🔒</span> {/* Icono de contraseña */}
              <input
                type="password"
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <a href="/recuperar-contrasena" className="forgot-password">
                ¿Olvidó su contraseña?
              </a>
            </div>
            {error && <p className="error-message">{error}</p>}{" "}
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Recordar credenciales</label>
            </div>
            <div className="loginBotones">
              <button lang="es" type="submit" className="login-btn">
                Iniciar sesión
              </button>

              <button lang="es" className="login-btn" onClick={handleRegister}>
                Regístrate
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
