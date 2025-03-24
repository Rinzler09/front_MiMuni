import React, { useState } from "react";
import Municipalidad from "../ImagesComponents/Municipalidad";

const ImpuestoPersonal: React.FC = () => {

  return (
    <div className="detalles-impuesto-container">
      <div className="title">ESTADO DE CUENTA DE IMPUESTO PERSONAL</div>      

      <br />
      <p> <strong>EN PROCESO DE MANTENIMIENTO</strong></p>
      <Municipalidad/>
    </div>
  );
};

export default ImpuestoPersonal;
