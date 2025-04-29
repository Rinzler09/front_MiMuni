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
import {toast } from "sonner";

// Hook genérico para cualquier dato no sensible en sessionStorage
function useSessionStorageState<T>(
  key: string,
  defaultValue: T
): [T, Dispatch<SetStateAction<T>>] {
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
    if (state === null || state === undefined) {
      sessionStorage.removeItem(key);
    } else {
      sessionStorage.setItem(key, JSON.stringify(state));
    }
  }, [key, state]);

  return [state, setState];
}

// Interface de usuario
export type User = {
  nombre?: string;
  municipalidades?: string[];
  token?: string;
  email?: string;
  temporaryPassword?: string;
};

interface AuthContextProps {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  selectedMunicipality: string | null;
  setSelectedMunicipality: Dispatch<SetStateAction<string | null>>;
  isLoading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Estado de usuario en memoria
  const [user, setUser] = useState<User | null>(null);
  // Persistir solo municipalidad seleccionada
  const [selectedMunicipality, setSelectedMunicipality] =
    useSessionStorageState<string | null>("selectedMunicipality", null);
  // No hay carga inicial de backend en este ejemplo
  const [isLoading] = useState(false);

  // Control de inactividad
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const INACTIVITY_LIMIT = 15 * 60 * 1000; // 1 minuto

  // Función para mostrar el toast y luego cerrar sesión
  const logout = () => {
    // Primero mostramos el mensaje de advertencia
    toast.info('Sesión se cerrará por inactividad.', {
      //icon: '⚠️',
      duration: 5000,  // Duración del toast en ms
      position: 'top-center',
    });
    // Después de que el toast termine, limpiamos el estado
    setTimeout(() => {
      setUser(null);
      setSelectedMunicipality(null);
    }, 4000);
  };

  // Reiniciar temporizador de inactividad
  const resetTimer = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(logout, INACTIVITY_LIMIT);
  };

  // Efecto para monitorear actividad cuando hay usuario
  useEffect(() => {
    if (!user) {
      return; // no listeners si no hay usuario
    }
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'] as const;
    // Asignación de listeners
    events.forEach((ev) => window.addEventListener(ev, resetTimer));
    // Inicio del conteo
    resetTimer();
    // Cleanup al desmontar o cambiar usuario
    return () => {
      if (timer.current) clearTimeout(timer.current);
      events.forEach((ev) => window.removeEventListener(ev, resetTimer));
    };
  }, [user]);

  return (    
    <AuthContext.Provider
      value={{
        user,
        setUser,
        selectedMunicipality,
        setSelectedMunicipality,
        isLoading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    console.warn('useAuth llamado fuera de AuthProvider, se devolverán valores por defecto');
    return {
      user: null,
      setUser: () => {},
      selectedMunicipality: null,
      setSelectedMunicipality: () => {},
      isLoading: false,
      logout: () => {},
    };
  }
  return context;
};
