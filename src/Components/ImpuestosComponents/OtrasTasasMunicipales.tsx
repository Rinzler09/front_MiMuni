import React, { useState } from "react";
import Municipalidad from "../ImagesComponents/Municipalidad";

const TasasMunicipales: React.FC = () => {

  return (
    <div className="detalles-impuesto-container">
      <h2 className="title">Tasa por Servicio a la Propiedad</h2>
      <Municipalidad />
      <br />
      <p><strong>EN PROCESO DE MANTENIMIENTO</strong></p>
    </div>
  );
};

export default TasasMunicipales;
