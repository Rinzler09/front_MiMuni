import React, { useState } from "react";
import Municipalidad from "../ImagesComponents/Municipalidad";

const ServiciosPublicos: React.FC = () => {
  return (
    <div className="detalles-impuesto-container">
      <div className="title"><Municipalidad />ESTADO DE CUENTA DE SERVICIOS PUBLICOS</div>   
     
      <br />
      <p><strong>EN PROCESO DE MANTENIMIENTO</strong></p>
    </div>
  );
};

export default ServiciosPublicos;
