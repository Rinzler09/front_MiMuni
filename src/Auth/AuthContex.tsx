import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

// Interface de usuario
interface User {
  nombre?: string;
  municipalidades?: string[];
  token?: string;
  email?: string;
  temporaryPassword?: string;
}

interface AuthContextProps {
  user: User | null;
  setUser: (user: User | null) => void;
  selectedMunicipality: string | null;
  setSelectedMunicipality: (municipality: string | null) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedMunicipality, setSelectedMunicipality] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Al montar, leemos de sessionStorage y rehidratamos el estado
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    const storedMunicipality = sessionStorage.getItem("selectedMunicipality");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedMunicipality) {
      setSelectedMunicipality(storedMunicipality);
    }

    setIsLoading(false);
  }, []);

  // Persistencia del usuario en sessionStorage (solo email)
  useEffect(() => {
    if (user) {
      // Extraemos únicamente los campos que nos interesan: email
      const { email } = user;
      const userDataToStore = { email };
      sessionStorage.setItem("user", JSON.stringify(userDataToStore));
    } else {
      sessionStorage.removeItem("user");
    }
  }, [user]);

  // Persistencia de la municipalidad seleccionada en sessionStorage
  useEffect(() => {
    if (selectedMunicipality) {
      sessionStorage.setItem("selectedMunicipality", selectedMunicipality);
    } else {
      sessionStorage.removeItem("selectedMunicipality");
    }
  }, [selectedMunicipality]);

  // Función para cerrar sesión: limpia el estado y el sessionStorage
  const logout = () => {
    setUser(null);
    setSelectedMunicipality(null);
    sessionStorage.clear();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        selectedMunicipality,
        setSelectedMunicipality,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};
