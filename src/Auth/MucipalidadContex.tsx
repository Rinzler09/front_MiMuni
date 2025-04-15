// MunicipalityContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface MunicipalityContextProps {
  selectedMunicipality: string | null;
  setSelectedMunicipality: (municipality: string | null) => void;
}

const MunicipalityContext = createContext<MunicipalityContextProps | undefined>(undefined);

export const MunicipalityProvider = ({ children }: { children: ReactNode }) => {
  const [selectedMunicipality, setSelectedMunicipality] = useState<string | null>(null);

  useEffect(() => {
    const storedMunicipality = sessionStorage.getItem("selectedMunicipality");
    if (storedMunicipality) {
      setSelectedMunicipality(storedMunicipality);
    }
  }, []);

  useEffect(() => {
    if (selectedMunicipality) {
      sessionStorage.setItem("selectedMunicipality", selectedMunicipality);
    } else {
      sessionStorage.removeItem("selectedMunicipality");
    }
  }, [selectedMunicipality]);

  return (
    <MunicipalityContext.Provider value={{ selectedMunicipality, setSelectedMunicipality }}>
      {children}
    </MunicipalityContext.Provider>
  );
};

export const useMunicipality = () => {
  const context = useContext(MunicipalityContext);
  if (!context) {
    throw new Error("useMunicipality debe ser usado dentro de un MunicipalityProvider");
  }
  return context;
};
