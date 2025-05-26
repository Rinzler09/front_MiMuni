import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useRef,
  Dispatch,
  SetStateAction,
} from "react";
import Modal from "../Components/attributeComponents/ModalComponents/modalComponent";
import { logoutUsuario } from "../services/EliminacionCookie";
import auth, {setAuthToken} from "../Auth/auth";

type SessionState<T> = [T, Dispatch<SetStateAction<T>>];
function useSessionStorageState<T>(
  key: string,
  defaultValue: T
): SessionState<T> {
  const [state, setState] = useState<T>(() => {
    const raw = sessionStorage.getItem(key);
    if (!raw) return defaultValue;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return defaultValue;
    }
  });
  useEffect(() => {
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
  token?: string;
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
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [selectedMunicipality, setSelectedMunicipality] =
    useSessionStorageState<string | null>("selectedMunicipality", null);
  const [isLoading] = useState(false);

  //Sincronizacion de token 
  useEffect(() =>{
    console.log("El token viene del auth:", token);
    setAuthToken(token);
  }, [token]); 

  
  // Modales y cuenta atrás
  const [showModal, setShowModal] = useState(false);
  const [showExpiredModal, setShowExpiredModal] = useState(false);
  const [countdown, setCountdown] = useState(0);
    // console.log("Activacion de la primera ventana modal", showModal);
    // console.log("Activacion de la primera ventana modal usando setShowModal", setShowModal);

    //Manejos de las ventanas modales usando UseEffect
  const showModalRef = useRef(showModal);
  const showExpiredRef = useRef(showExpiredModal);
  //Agregacion de los useEffect
  useEffect(() =>{
    showModalRef.current = showModal
  }, [showModal]);

  //Segundo useEffect
  useEffect(() =>{
    showExpiredRef.current = showExpiredModal;
  },[showExpiredRef]);

  const warningTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const expireTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const logoutDeadlineRef = useRef<number>(0);

  // Nuevos umbrales: advertencia tras 8 min, colapso en 30s
  const WARNING_THRESHOLD = 8 * 60 * 1000;     // 2 minutos
  const COLLAPSE_DURATION = 30 * 1000;         // 30 segundos


  const expireSession = () => {
    setShowModal(false);
    setShowExpiredModal(true);
  };

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
    }
  };

  const resetTimers = () => {
    if (warningTimer.current) clearTimeout(warningTimer.current);
    if (expireTimer.current) clearTimeout(expireTimer.current);
    if (countdownInterval.current) clearInterval(countdownInterval.current);

    setShowModal(false);
    setShowExpiredModal(false);

    // Fecha límite absoluta: ahora + WARNING_THRESHOLD + COLLAPSE_DURATION
    logoutDeadlineRef.current = Date.now() + WARNING_THRESHOLD + COLLAPSE_DURATION;

    // Programa advertencia a los 8 minutos
    warningTimer.current = setTimeout(() => {
      setShowModal(true);
      // Primer valor de cuenta atrás en segundos
      const msLeft = logoutDeadlineRef.current - Date.now();
      setCountdown(Math.ceil(msLeft / 1000));
    }, WARNING_THRESHOLD);

    // Programa expiración total después de 8m + 30s
    expireTimer.current = setTimeout(expireSession, WARNING_THRESHOLD + COLLAPSE_DURATION);
  };

  useEffect(() => {
    if (showModal) {
      countdownInterval.current = setInterval(() => {
        const msLeft = logoutDeadlineRef.current - Date.now();
        setCountdown(Math.max(Math.ceil(msLeft / 1000), 0));
      }, 1000);
    }
    return () => {
      if (countdownInterval.current) {
        clearInterval(countdownInterval.current);
        countdownInterval.current = null;
      }
    };
  }, [showModal]);

  useEffect(() => {
    if (!token || !user) return;
    const handleActivity = () => {
      if (!showModalRef.current && !showExpiredRef.current) {
        resetTimers();
      }
    };
    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"] as const;
    events.forEach(ev => window.addEventListener(ev, handleActivity));
    resetTimers();
    return () => {
      events.forEach(ev => window.removeEventListener(ev, handleActivity));
      if (warningTimer.current) clearTimeout(warningTimer.current);
      if (expireTimer.current) clearTimeout(expireTimer.current);
      if (countdownInterval.current) clearInterval(countdownInterval.current);
    };
  }, [token, user]);

  // Renovación de ACCESS_TOKEN.
 const renovacionAccessToken = async (currentToken: string) => {
  if (showExpiredModal) return;
    console.log("renovacionAccessToken enviando al refresh:", currentToken);
    try {
      const resp = await fetch(
        "http://localhost:3000/api/v1/refresh_AcTkn",
        {
          method: "POST",
          credentials: "include",
          headers: { Authorization: `Bearer ${currentToken}` },
        }
      );

      // Extrae el header con el JWT nuevo
      const authHeader =
        resp.headers.get("Authorization") ||
        resp.headers.get("authorization") ||
        resp.headers.get("x-access-token");

      if (!authHeader) {
        console.error("No llegó ningún header con el token");
        return;
      }

      // Quita el prefijo "Bearer "
      const newToken = authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : authHeader;

      console.log("renovacionAccessToken nuevo token desde header:", newToken);
      setToken(newToken);
    } catch (err: any) {
      console.error(" renovacionAccessToken error:", err);
    }
  };


// Hook que llama a renovacionAccessToken cada 9 min
useEffect(() => {
  console.log("AuthContext efecto de renovación, token actual:", token);
  if (!token || showExpiredModal) return;

  const intervalId = setInterval(() => {
    renovacionAccessToken(token);
  }, 9 * 60 * 1000);

  return () => {
    console.log("[AuthContext] limpiando intervalo de token:", intervalId);
    clearInterval(intervalId);
  };
}, [token, showExpiredModal]);


  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken, selectedMunicipality, setSelectedMunicipality, isLoading, logout }}>
      {children}

      {/* Warning Modal */}
      <Modal isVisible={showModal} title="Información de sesión" showCloseButton={false}>
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <p>
            Su sesión caducará en{' '}
            <strong>{countdown}</strong> segundo{countdown !== 1 ? 's' : ''}.
          </p>
          <button className="modal-button" onClick={resetTimers}> Continuar trabajando</button>
        </div>
      </Modal>

      {/* Expired Modal */}
      <Modal isVisible={showExpiredModal} title="La sesión ha caducado" message="Su sesión ha caducado. Inicie sesión de nuevo." showCloseButton={false}>
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <button className="modal-button" onClick={logout}> Iniciar sesión </button>
        </div>
      </Modal>
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    console.warn("useAuth llamado fuera de AuthProvider");
    return {
      user: null,
      setUser: () => {},
      token: null,
      setToken: () => {},
      selectedMunicipality: null,
      setSelectedMunicipality: () => {},
      isLoading: false,
      logout: () => {},
    };
  }
  return context;
};
