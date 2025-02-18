import React from "react";
import "../../style/PresentacionesStyles/renovaciones.css";
import Municipalidad from "../ImagesComponents/Municipalidad";

const Renovaciones: React.FC = () => {

    return (
        <div className="detalles-impuesto-container">
            <h2 className="title">Renovaciones</h2>
            <Municipalidad />
            <br />
            <p><strong>EN PROCESO DE MANTENIMIENTO</strong></p>
        </div>
    );
};

export default Renovaciones;
