import React, { useState } from "react";
import Municipalidad from "../ImagesComponents/Municipalidad";

const ImpuestoPersonal: React.FC = () => {

  return (
    <div className="detalles-impuesto-container">
      <div className="title"><Municipalidad />ESTADO DE CUENTA DE IMPUESTO PERSONAL</div>      

      <br />
      <p> <strong>EN PROCESO DE MANTENIMIENTO</strong></p>
    </div>
  );
};

export default ImpuestoPersonal;
