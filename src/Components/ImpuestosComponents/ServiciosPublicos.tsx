import React, { useState } from "react";
import Municipalidad from "../ImagesComponents/Municipalidad";
import "../../style/ImpuestosStyles/serviciosPublicos.css";


const ServiciosPublicos: React.FC = () => {
  return (
    <div className="detalles-impuesto-container">
      <div className="title">ESTADO DE CUENTA DE SERVICIOS PUBLICOS</div>

      <br />
      <p><strong>EN PROCESO DE MANTENIMIENTO</strong></p>
      <Municipalidad />
    </div>
  );
};

export default ServiciosPublicos;
