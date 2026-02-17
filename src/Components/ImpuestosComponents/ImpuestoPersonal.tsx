import React, { useState } from "react";
import Municipalidad from "../ImagesComponents/Municipalidad";
import "../../style/ImpuestosStyles/impuestoPersonal.css";

const ImpuestoPersonal: React.FC = () => {

  return (
    <div className="detalles-impuesto-containers">
      <div className="title">ESTADO DE CUENTA DE IMPUESTO PERSONAL / VECINAL</div>

      <br />
      <p> <strong>EN PROCESO DE MANTENIMIENTO</strong></p>
      <Municipalidad />
    </div>
  );
};

export default ImpuestoPersonal;
