import React from "react";
import Municipalidad from "../ImagesComponents/Municipalidad";
import "../../style/ImpuestosStyles/otrasTasasMunicipales.css";


const TasasMunicipales: React.FC = () => {

  return (
    <div className="detalles-impuesto-container">
      <div className="title">ESTADO DE CUENTA DE TASA POR SERVICIOS A LA PROPIEDAD</div>

      <br />
      <p><strong>EN PROCESO DE CONSTRUCCIÓN</strong></p>
      <Municipalidad />
      <br />
    </div>
  );
};

export default TasasMunicipales;
