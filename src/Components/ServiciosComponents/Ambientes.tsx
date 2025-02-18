import React from "react";
import Municipalidad from "../ImagesComponents/Municipalidad";

const ServiciosAmbientales: React.FC = () => {
  return (
    <div className="detalles-impuesto-container">
      <h2 className="title">Ambientales</h2>
      <Municipalidad />
      <br />
      <p><strong>EN PROCESO DE MANTENIMIENTO</strong></p>
    </div>
  );
};

export default ServiciosAmbientales;
