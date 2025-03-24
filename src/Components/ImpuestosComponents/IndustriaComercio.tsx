import React from "react";
import Municipalidad from "../ImagesComponents/Municipalidad";

const ProceosFacturacion: React.FC = () => {


  return (
    <div className="detalles-impuesto-container">
      <div className="title">ESTADO DE CUENTA DE INDUSTRIAS, CS</div>   
      
      <br />
      <p> <strong>EN PROCESO DE MANTENIMIENTO</strong></p>
      <Municipalidad/>
    </div>
  )
};

export default ProceosFacturacion;
