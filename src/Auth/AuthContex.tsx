import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

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
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedMunicipality, setSelectedMunicipality] = useState<string | null>(null);

  // Al montar, leemos de sessionStorage
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    const storedMunicipality = sessionStorage.getItem("selectedMunicipality");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedMunicipality) {
      setSelectedMunicipality(storedMunicipality);
    }
  }, []);

  // Cada vez que 'user' cambie, lo guardamos o eliminamos de sessionStorage
  useEffect(() => {
    if (user) {
      sessionStorage.setItem("user", JSON.stringify(user));
    } else {
      sessionStorage.removeItem("user");
    }
  }, [user]);

  // Cada vez que 'selectedMunicipality' cambie, lo guardamos o eliminamos de sessionStorage
  useEffect(() => {
    if (selectedMunicipality) {
      sessionStorage.setItem("selectedMunicipality", selectedMunicipality);
    } else {
      sessionStorage.removeItem("selectedMunicipality");
    }
  }, [selectedMunicipality]);

  // Función de logout para borrar el estado y el sessionStorage
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
