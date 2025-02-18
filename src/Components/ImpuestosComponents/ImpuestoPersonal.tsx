import React, { useState } from "react";
import Municipalidad from "../ImagesComponents/Municipalidad";

const ImpuestoPersonal: React.FC = () => {

  return (
    <div className="detalles-impuesto-container">
      <h2 className="title">Impuesto Personal</h2>
      <Municipalidad />

      <br />
      <p> <strong>EN PROCESO DE MANTENIMIENTO</strong></p>
    </div>
  );
};

export default ImpuestoPersonal;
