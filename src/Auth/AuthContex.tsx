import React, { createContext, useContext, useState, ReactNode } from "react";

interface User {
  nombre?: string;
  municipalidades?: string[]; 
  token?: string;
  email?:string;
  temporaryPassword?: string;  // Ajusta según tu backend
}

interface AuthContextProps {
  user: User | null;
  setUser: (user: User | null) => void;

  selectedMunicipality: string | null;
  setSelectedMunicipality: (municipality:string | null) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedMunicipality, setSelectedMunicipality] = useState<string | null>(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        selectedMunicipality,
        setSelectedMunicipality,
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
