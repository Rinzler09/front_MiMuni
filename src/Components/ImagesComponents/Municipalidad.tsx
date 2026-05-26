import React from "react";
import "../../style/ImagesStyles/imagenMunicipalidad.css";
import logoMML from "../../../src/assets/img/MML_Logo.jpg";


const Municipalidad: React.FC = () => {

    return (
        <div className="img-Municipalidad">
            <img src={logoMML} />
        </div>
    );
};

export default Municipalidad;
