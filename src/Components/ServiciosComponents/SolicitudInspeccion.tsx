import React from "react";
import Municipalidad from "../ImagesComponents/Municipalidad";

const SolicitudInspeccion: React.FC = () => {
  return (
    <div className="detalles-impuesto-container">
      <h2 className="title">Solicitud de Inspeccion</h2>
      <Municipalidad />
      <br />
      <p> <strong>EN PROCESO DE MANTENIMIENTO</strong></p>
    </div>
  );
};

export default SolicitudInspeccion;
