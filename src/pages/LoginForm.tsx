import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/PagesStyles/loginFormStyles.css";
import { login } from "../services/loginFormServices"; // Importa el servicio
import { Toaster, toast } from "sonner";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await login(email, password);
      // Guarda el correo en localStorage
      localStorage.setItem("correo", email);
      localStorage.setItem("cotraseñ temporal", password);

      if (data.success) {
        if (data.isTemporaryPassword) {
          // Si es una contraseña temporal, redirige a la página de cambio de contraseña
          setTimeout(() => {navigate("/cambio-contraseña");}, 4000); // 3000 ms = 3 segundos
        } else {
          // Si es una contraseña establecida, redirige al Dashboard
          setTimeout(() => {navigate("/dashboard");}, 4000); // 8000 ms = 3 segundos
        }
      }
    } catch (err: any) {
      // Manejo de errores
      toast.error(err.message || "Error al iniciar sesión");
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/registrar-usuario");
  };

  return (
    <div className="background">
      <Toaster position="top-right" /> {/* Este es el contenedor para los toasts */}
      <div className="circle circle1"></div>
      <div className="circle circle2"></div>
      <div className="circle circle3"></div>

      <div className="login-wrapper">
        <div className="left-section">
          <div className="top-image">
            <h2 className="titu">Mi Muni en Línea</h2>
          </div>
          <img src="src/assets/LogoGeoRedes.png" alt="Illustration" className="illustration" />
        </div>

        <div className="right-section">
          <h2 className="titu">LOGIN</h2>
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <span className="icon">👤</span>
              <input
                type="text" placeholder="Ingrese su email" value={email} onChange={(e) => setEmail(e.target.value)} required
              />
            </div>

            <div className="input-group">
              <span className="icon">🔒</span>
              <input
                type="password" placeholder="Ingrese su contraseña" value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <a href="/recuperar-contrasena" className="forgot-password">¿Olvidó su contraseña?</a>
            </div>

            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Recordar credenciales</label>
            </div>
            <div className="loginBotones">
              <button type="submit" className="login-btn"> Iniciar sesión </button>
              <button className="login-btn" onClick={handleRegister}>Activar Cuenta</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
