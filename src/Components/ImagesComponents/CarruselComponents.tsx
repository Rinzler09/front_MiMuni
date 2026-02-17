import React, { useEffect } from "react";
import { Carousel as BSCarousel } from "bootstrap";
import "../../style/ImagesStyles/dashboard.css";
import {carrruselInfo} from "../shared/Carrusel/carruselComponent";//Importacion del carruselInfo que contiene las imagenes y textos del carrusel
import { useAuth } from "../../Auth/AuthContext";
import {getMunicipialkey} from "../../types/generalForm";


interface municiapalidadesProps {
  municipio: string;
}

const CarruselComponents: React.FC = () => {
  const { selectedMunicipality } = useAuth();
  const municipiokey = selectedMunicipality ? getMunicipialkey(selectedMunicipality) : "undefined";; // Obtener la clave del municipio seleccionado, con un valor predeterminado
  const  informacionCarrusel = carrruselInfo[municipiokey] || [];

   
  useEffect(() => {
    const carouselElement = document.getElementById(
      "carouselHeroMunicipal"
    );

    if (carouselElement) {
      new BSCarousel(carouselElement, {
        interval: 8000,
        ride: "carousel",
        pause: false,
        touch: true,
      });
    }
  }, []);

  return (
    <main className="hero-carousel-container">
      <div  id="carouselHeroMunicipal" className="carousel slide carousel-fade hero-carousel">

        {/* INDICADORES */}
        <div className="carousel-indicators hero-indicators">
          <button type="button"  data-bs-target="#carouselHeroMunicipal"
            data-bs-slide-to="0"  className="active" aria-current="true"/>
          <button  type="button" data-bs-target="#carouselHeroMunicipal" data-bs-slide-to="1" />
          <button  type="button" data-bs-target="#carouselHeroMunicipal"  data-bs-slide-to="2"/> 
        </div>

        {/* SLIDES, se tiene que mejorar la logica de de compartidos en punto que tenemos que mandar llamar*/}
        <div className="carousel-inner">
          {informacionCarrusel.map((item, index) => (
            <div key={item.id} className={`carousel-item hero-slide ${index === 0 ? "active" : ""}`}>  
            <img src={item.imageUrls[0]} className="imgcarousel" alt={item.title}/>
            <div className="carousel-caption hero-caption">
              <h1 className="titleCaurousel">{item.title}</h1>
              <p className="descripCarousel">{item.description}</p>
            </div>
          </div>
          ))}
          
        </div>

        {/* CONTROLES */}
        <button className="carousel-control-prev hero-control"
          type="button" data-bs-target="#carouselHeroMunicipal" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" />
        </button>

        <button  className="carousel-control-next hero-control"
          type="button" data-bs-target="#carouselHeroMunicipal" data-bs-slide="next">
          <span className="carousel-control-next-icon" />
        </button>
      </div>
    </main>
    
  );
  
};

export default CarruselComponents;
