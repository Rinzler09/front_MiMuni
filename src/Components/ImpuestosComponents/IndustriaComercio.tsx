import React from "react";
import Municipalidad from "../ImagesComponents/Municipalidad";

const ProceosFacturacion: React.FC = () => {


  return (
    <div className="detalles-impuesto-container">
      <h2 className="title">Industria, Comercio y Servicios</h2>
      <Municipalidad />
      <br />
      <p> <strong>EN PROCESO DE MANTENIMIENTO</strong></p>
    </div>
  )
};

export default ProceosFacturacion;
