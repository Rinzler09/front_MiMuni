import React from "react";

import "../../style/prueba.css"; // Archivo de estilo para los componentes
import Municipalidad from "../Images/Municipalidad";

const VolumenVentas: React.FC = () => {
  return (
    <div className="detalles-impuesto-container">
      <h2 className="title">Declaraciones Volumen de Ventas</h2>
      <Municipalidad />

      <p>EN PROCESO DE MANTENIMIENTO</p>
    </div>
  );
};

export default VolumenVentas;
