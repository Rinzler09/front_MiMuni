import React from "react";
import Municipalidad from "../ImagesComponents/Municipalidad";
import "../../style/ImpuestosStyles/industriaComercio.css";

const ProceosFacturacion: React.FC = () => {


  return (
    <div className="detalles-impuesto-containers">
      <div className="title">ESTADO DE CUENTA DE INDUSTRIAS, COMERCIO y SERVICIO</div>

      <br />
      <p> <strong>EN PROCESO DE MANTENIMIENTO</strong></p>
      <Municipalidad />
    </div>
  )
};

export default ProceosFacturacion;
