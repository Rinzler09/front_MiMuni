import React, { useState } from "react";
import Municipalidad from "../ImagesComponents/Municipalidad";

const ServiciosPublicos: React.FC = () => {
  return (
    <div className="detalles-impuesto-container">
      <h2 className="title">Servicios Publicos</h2>
      <Municipalidad />
      <br />
      <p><strong>EN PROCESO DE MANTENIMIENTO</strong></p>
    </div>
  );
};

export default ServiciosPublicos;
