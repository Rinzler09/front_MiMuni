// InactivityHandler.tsx
import React, { useEffect, useRef, useState, ReactNode } from 'react';
import { useAuth } from '../Auth/AuthContex' // Asegúrate de que la ruta sea correcta
import { Toaster, toast } from "sonner";

interface InactivityHandlerProps {
    children: ReactNode;
  }
  
  const InactivityHandler: React.FC<InactivityHandlerProps> = ({ children }) => {
    const [inactive, setInactive] = useState(false);
    const timerRef = useRef<number | null>(null);
    const { logout } = useAuth(); // Obtenemos la función logout desde el contexto
  
    // Función que reinicia el temporizador
    const resetTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      // Establece el timeout para 1 minuto (60 * 1000 ms)
      timerRef.current = window.setTimeout(() => {
        setInactive(true);
        // Mostrar un toast con estilo personalizado y acción
        //  toast('Tu sesión ha expirado por inactividad', {
          
        //    action: {
        //      label: 'Ir al login',
        //      onClick: () => {
        //        logout();
        //        window.location.href = '/'; // Ajusta la ruta al login según tu aplicación
        //      },
        //    },
        //  });
      }, 9 * 60 * 1000);
    };
  
    useEffect(() => {
      // Eventos que consideramos interacción
      const events = ['mousemove', 'keypress', 'click', 'scroll'];
  
      const handleActivity = () => {
        if (inactive) setInactive(false);
        resetTimer();
      };
  
      // Se agregan los event listeners a nivel global
      events.forEach(event => window.addEventListener(event, handleActivity));
      // Inicializamos el temporizador
      resetTimer();
  
      // Cleanup: eliminar el temporizador y los listeners al desmontar
      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
        events.forEach(event => window.removeEventListener(event, handleActivity));
      };
    }, [inactive]);
  
    return (
      <>
        {children}
        {/* Agregamos el Toaster para que se muestren los toasts */}
        <Toaster richColors position="top-right" />
      </>
    );
  };
  
  export default InactivityHandler;