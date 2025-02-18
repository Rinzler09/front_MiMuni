import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../../style/ImagesStyles/dashboard.css";

const INACTIVITY_TIMEOUT = 120 * 60 * 1000; // 5 minutos de inactividad

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [timer, setTimer] = useState<number | null>(null);

  const resetTimer = () => {
    if (timer) clearTimeout(timer);
    const newTimer = window.setTimeout(() => {
      navigate("/"); // Redirige al login
    }, INACTIVITY_TIMEOUT);
    setTimer(newTimer);
  };

  useEffect(() => {
    // Configura el evento para detectar actividad
    const handleActivity = () => resetTimer();

    // Escucha de eventos
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);

    // Inicia el temporizador la primera vez
    resetTimer();

    return () => {
      // Limpia los eventos y el temporizador al desmontar el componente
      if (timer) clearTimeout(timer);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
    };
  }, [timer]);

  return (
    <div className="layout">

      <div className="layout-content">

        <main className="main-content">
          {/* Aquí insertas el contenido principal con la imagen */}

          <div className="center-content imgMuni">
            <h1 className="display-3">Mi Muni en Línea</h1>{/*Display 3 es una clase de Bootstrap para titulos*/}
            <img src="src\assets\LogoGeoRedes.png" />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
