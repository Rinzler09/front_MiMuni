// src/hooks/useSessionModal.tsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../Components/attributeComponents/ModalComponents/modalComponent";
import { subscribeAuthToken, getAuthToken } from "../Auth/auth";

interface UseSessionModalOptions {
  /** Minuto para el primer warning (por defecto: 7) */
  warningAtMin?: number;
  /** Segundos de prórroga tras el warning (por defecto: 150 = 2m30s) */
  collapseDurationSec?: number;
  /** Callback opcional al expirar la sesión */
  onExpire?: () => void;
}

export function useSessionModal({
  warningAtMin = 7,
  collapseDurationSec = 150,
  onExpire,
}: UseSessionModalOptions = {}) {
  const navigate = useNavigate();

  // Estado del token de autenticación
  const [token, setToken] = useState<string | null>(() => getAuthToken());
  // Visibilidad de modales
  const [showWarning, setShowWarning] = useState(false);
  const [showExpired, setShowExpired] = useState(false);
  // Contador de cuenta atrás
  const [countdown, setCountdown] = useState(0);

  // Refs para timers y fecha límite
  const warningTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const expireTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const deadlineRef = useRef<number>(0);

  // Claves para sessionStorage
  const STORAGE_WARNING = 'sessionWarningTime';
  const STORAGE_EXPIRY  = 'sessionExpirationTime';

  const saveSchedule = (warningTime: number, expirationTime: number) => {
    sessionStorage.setItem(STORAGE_WARNING, warningTime.toString());
    sessionStorage.setItem(STORAGE_EXPIRY,  expirationTime.toString());
  };
  const clearSchedule = () => {
    sessionStorage.removeItem(STORAGE_WARNING);
    sessionStorage.removeItem(STORAGE_EXPIRY);
  };

  // Limpia todos los timers
  const clearTimers = () => {
    if (warningTimer.current) clearTimeout(warningTimer.current);
    if (expireTimer.current) clearTimeout(expireTimer.current);
    if (countdownInterval.current) clearInterval(countdownInterval.current);
  };

  // Expira la sesión
  const expireSession = () => {
    setShowWarning(false);
    setShowExpired(true);
    clearTimers();
    clearSchedule();
    if (onExpire) onExpire();
  };

  // Programa el warning tras warningAtMin minutos
  const scheduleWarning = () => {
    clearTimers();
    setShowWarning(false);
    setShowExpired(false);

    const msToWarning = warningAtMin * 60 * 1000;
    const warningTime  = Date.now() + msToWarning;
    const expireMs     = collapseDurationSec * 1000;
    const expirationTime = warningTime + expireMs;

    // Persistimos el plan de vuelo
    saveSchedule(warningTime, expirationTime);

    // Programamos warning
    warningTimer.current = setTimeout(() => {
      setShowWarning(true);
      deadlineRef.current = expirationTime;
      setCountdown(Math.ceil(expireMs / 1000));
      sessionStorage.removeItem(STORAGE_WARNING);
      expireTimer.current = setTimeout(expireSession, expireMs);
    }, msToWarning);
  };

  // Extiende la sesión
  const extendSession = () => {
    clearTimers();
    setShowWarning(false);

    const expireMs       = collapseDurationSec * 1000;
    const expirationTime = Date.now() + expireMs;
    deadlineRef.current  = expirationTime;
    setCountdown(Math.ceil(expireMs / 1000));

    sessionStorage.setItem(STORAGE_EXPIRY, expirationTime.toString());
    expireTimer.current = setTimeout(expireSession, expireMs);
  };

  // Suscripción al token
  useEffect(() => {
    const unsub = subscribeAuthToken((newToken) => setToken(newToken));
    return unsub;
  }, []);

  // Al cambiar token, programamos o limpiamos teniendo en cuenta reloads
  useEffect(() => {
    if (token) {
      const sv = sessionStorage.getItem(STORAGE_WARNING);
      const se = sessionStorage.getItem(STORAGE_EXPIRY);
      const now = Date.now();

      if (se) {
        const expirationTime = parseInt(se, 10);
        if (now >= expirationTime) {
          setShowExpired(true);
          clearTimers();
          clearSchedule();
          if (onExpire) onExpire();
          return;
        }

        const remaining      = expirationTime - now;
        const warningTimeNum = sv
          ? parseInt(sv, 10)
          : expirationTime - collapseDurationSec * 1000;

        if (sv && now < warningTimeNum) {
          const msToWarning = warningTimeNum - now;
          deadlineRef.current = expirationTime;
          warningTimer.current = setTimeout(() => {
            setShowWarning(true);
            setCountdown(Math.ceil((expirationTime - Date.now()) / 1000));
            expireTimer.current = setTimeout(expireSession, expirationTime - Date.now());
            sessionStorage.removeItem(STORAGE_WARNING);
          }, msToWarning);
        } else {
          setShowWarning(true);
          deadlineRef.current = expirationTime;
          setCountdown(Math.ceil(remaining / 1000));
          expireTimer.current = setTimeout(expireSession, remaining);
        }
      } else {
        scheduleWarning();
      }
    } else {
      setShowWarning(false);
      setShowExpired(false);
      clearTimers();
      // mantenemos el storage hasta el reinicio explícito
    }
  }, [token, warningAtMin, collapseDurationSec]);

  // Cuenta atrás cuando mostramos warning
  useEffect(() => {
    if (!showWarning) return;
    countdownInterval.current = setInterval(() => {
      const secs = Math.max(Math.ceil((deadlineRef.current - Date.now()) / 1000), 0);
      setCountdown(secs);
    }, 1000);
    return () => {
      if (countdownInterval.current) clearInterval(countdownInterval.current);
    };
  }, [showWarning]);

  // JSX de modales
  const Modals = (
    <>
      <Modal isVisible={showWarning} title="¿Sigues ahí?" showCloseButton={false}>
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <p>Recuerda que no has cambiado tu contraseña aún.</p>
          <p>
            Se cerrará en <strong>{countdown}</strong> segundo
            {countdown !== 1 ? 's' : ''}.
          </p>
          <button className="modal-button" onClick={extendSession}>
            Continuar trabajando
          </button>
        </div>
      </Modal>

      <Modal isVisible={showExpired} title="Tiempo agotado" showCloseButton={false}>
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <button
            className="modal-button"
            onClick={() => {
              // Reinicio explícito: borramos storage y redirigimos
              clearSchedule();
              setToken(null);
              navigate('/');
            }}
          >
            Reintentar
          </button>
        </div>
      </Modal>
    </>
  );

  return { Modals };
}
