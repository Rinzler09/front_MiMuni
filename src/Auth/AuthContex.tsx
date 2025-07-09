// src/Context/AuthContext.tsx

import React, {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useRef,
  Dispatch,
  SetStateAction,
} from "react";
import Modal from "../Components/attributeComponents/ModalComponents/modalComponent";
import { logoutUsuario } from "../services/EliminacionCookie";
import { setAuthToken } from "../Auth/auth";

// Reusa tu hook genérico
type SessionState<T> = [T, Dispatch<SetStateAction<T>>];
function useSessionStorageState<T>(
  key: string,
  defaultValue: T
): SessionState<T> {
  const [state, setState] = React.useState<T>(() => {
    const raw = sessionStorage.getItem(key);
    if (!raw) return defaultValue;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return defaultValue;
    }
  });
  React.useEffect(() => {
    if (state == null) {
      sessionStorage.removeItem(key);
    } else {
      sessionStorage.setItem(key, JSON.stringify(state));
    }
  }, [key, state]);
  return [state, setState];
}

type User = {
  nombre?: string;
  municipalidades?: string[];
  email?: string;
  temporaryPassword?: string;
};

interface AuthContextProps {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  token: string | null;
  setToken: Dispatch<SetStateAction<string | null>>;
  selectedMunicipality: string | null;
  setSelectedMunicipality: Dispatch<SetStateAction<string | null>>;
  isLoading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Ahora se usa sessionStorage para user y token
  const [user, setUser] = useSessionStorageState<User | null>(
    "AuthUser",
    null
  );
  const [token, setToken] = useSessionStorageState<string | null>(
    "Token",
    null
  );
  const [selectedMunicipality, setSelectedMunicipality] =
    useSessionStorageState<string | null>(
      "selectedMunicipality",
      null
    );
  const [isLoading] = React.useState(false);

  // Sincroniza con Axios cada vez que cambie el token
  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  // ——— lógica de modales y cuenta atrás ———
  const [showModal, setShowModal] = React.useState(false);
  const [showExpiredModal, setShowExpiredModal] = React.useState(false);
  const [countdown, setCountdown] = React.useState(0);

  const showModalRef = useRef(showModal);
  const showExpiredRef = useRef(showExpiredModal);

  useEffect(() => {
    showModalRef.current = showModal;
  }, [showModal]);
  useEffect(() => {
    showExpiredRef.current = showExpiredModal;
  }, [showExpiredModal]);

  const warningTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const expireTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownInterval = useRef<ReturnType<typeof setInterval> | null>(
    null
  );
  const logoutDeadlineRef = useRef<number>(0);

  const WARNING_THRESHOLD = 8 * 60 * 1000; // 8 min
  const COLLAPSE_DURATION = 30 * 1000;     // 30 s

  const expireSession = () => {
    setShowModal(false);
    setShowExpiredModal(true);
  };

  const resetTimers = () => {
    warningTimer.current && clearTimeout(warningTimer.current);
    expireTimer.current && clearTimeout(expireTimer.current);
    countdownInterval.current && clearInterval(countdownInterval.current);

    setShowModal(false);
    setShowExpiredModal(false);

    logoutDeadlineRef.current = Date.now() + WARNING_THRESHOLD + COLLAPSE_DURATION;

    warningTimer.current = setTimeout(() => {
      setShowModal(true);
      const msLeft = logoutDeadlineRef.current - Date.now();
      setCountdown(Math.ceil(msLeft / 1000));
    }, WARNING_THRESHOLD);

    expireTimer.current = setTimeout(
      expireSession,
      WARNING_THRESHOLD + COLLAPSE_DURATION
    );
  };

  useEffect(() => {
    if (showModal) {
      countdownInterval.current = setInterval(() => {
        const msLeft = logoutDeadlineRef.current - Date.now();
        setCountdown(Math.max(Math.ceil(msLeft / 1000), 0));
      }, 1000);
    }
    return () => {
      if (countdownInterval.current) clearInterval(countdownInterval.current);
    };
  }, [showModal]);

  useEffect(() => {
    if (!token || !user) return;
    const handleActivity = () => {
      if (!showModalRef.current && !showExpiredRef.current) {
        resetTimers();
      }
    };
    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "touchstart",
      "scroll",
    ] as const;
    events.forEach((ev) => window.addEventListener(ev, handleActivity));
    resetTimers();
    return () => {
      events.forEach((ev) => window.removeEventListener(ev, handleActivity));
      warningTimer.current && clearTimeout(warningTimer.current);
      expireTimer.current && clearTimeout(expireTimer.current);
      countdownInterval.current && clearInterval(countdownInterval.current);
    };
  }, [token, user]);

  // Logout: limpia todo (estado, sessionStorage y Axios)
  const logout = async () => {
    try {
      if (token) await logoutUsuario(token);
    } catch (err) {
      console.error(err);
    } finally {
      setShowModal(false);
      setShowExpiredModal(false);
      setUser(null);
      setSelectedMunicipality(null);
      setToken(null);
      sessionStorage.removeItem("AuthUser");
      sessionStorage.removeItem("Token");
      // sessionStorage limpiado automáticamente por useSessionStorageState
    }
  };

  // Renovación de token (igual que antes)…
  // — aquí iría tu función `renovacionAccessToken` y su useEffect —
  // …

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        selectedMunicipality,
        setSelectedMunicipality,
        isLoading,
        logout,
      }}
    >
      {children}

      {/* Warning Modal */}
      <Modal
        isVisible={showModal}
        title="Información de sesión"
        showCloseButton={false}
      >
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <p>
            Su sesión caducará en <strong>{countdown}</strong> segundo
            {countdown !== 1 ? "s" : ""}.
          </p>
          <button className="modal-button" onClick={resetTimers}>
            Continuar trabajando
          </button>
        </div>
      </Modal>

      {/* Expired Modal */}
      <Modal
        isVisible={showExpiredModal}
        title="La sesión ha caducado"
        message="Su sesión ha caducado. Inicie sesión de nuevo."
        showCloseButton={false}
      >
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <button className="modal-button" onClick={logout}>
            Iniciar sesión
          </button>
        </div>
      </Modal>
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
};
