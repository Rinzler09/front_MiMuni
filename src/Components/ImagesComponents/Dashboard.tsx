// src/pages/Dashboard.tsx
import React, { useEffect } from 'react';
import '../../style/ImagesStyles/dashboard.css';
import { Carousel as BSCarousel } from 'bootstrap';

const Dashboard: React.FC = () => {
  useEffect(() => {
    //Tenemos declardo un indice, que corresponde al contenedor del carousel de Booststrap
    const indice = document.getElementById('carouselExampleIndicators');

    if (indice) {//Si existe ese elemento en la página, lo inicializamos como un carousel de Bootstrap.
      new BSCarousel(indice, {
        interval: 4000,// cada 4000 ms (4 s) avanza automáticamente al siguiente slide
        ride: 'carousel',// arranca el ciclo automáticamente al cargar
        pause: false, // no se detiene al pasar el ratón por encima
      });
    }
    //El array vacío [] como segundo parámetro hace que este efecto solo se ejecute una vez (al montar el componente).
  }, []);

  return (
    <div className="layout">
      <div className="layout-content">
        <main className="main-content full-carousel-container">
          <div
            id="carouselExampleIndicators"
            className="carousel slide carousel-fade full-carousel"
            data-bs-ride="carousel"
            data-bs-interval="4000"
          >
            <div className="carousel-indicators">
              <button
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide-to="0"
                className="active"
                aria-current="true"
                aria-label="Slide 1"
              ></button>
              <button
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide-to="1"
                aria-label="Slide 2"
              ></button>
              <button
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide-to="2"
                aria-label="Slide 3"
              ></button>
            </div>
            <div className="carousel-inner">
              <div className="carousel-item active">
                <img
                  src="/img/alcaldia.jpg"
                  className="d-block carousel-image"
                  alt="Alcaldía"
                />
                <div className="carousel-caption d-none d-md-block">
                  <h5>Bienvenido a tu Municipalidad de confianza </h5>
                </div>
              </div>
              <div className="carousel-item">
                <img
                  src="/img/ValleDeAngeles.jpg"
                  className="d-block carousel-image"
                  alt="Noticias"
                />
                <div className="carousel-caption d-none d-md-block">
                  <h5>Servicios Municipales en Línea</h5>
                </div>
              </div>
              <div className="carousel-item">
                <img
                  src="/img/Santa.jpg"
                  className="d-block carousel-image"
                  alt="Santa Lucía"
                />
                <div className="carousel-caption d-none d-md-block">
                  <h5>Gestión ágil y segura</h5>
                </div>
              </div>
            </div>

            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide="prev"
            >
              <span
                className="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Anterior</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide="next"
            >
              <span
                className="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Siguiente</span>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};
export default Dashboard;
