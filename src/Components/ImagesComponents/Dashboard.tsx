import React from "react";
import "../../style/ImagesStyles/dashboard.css";

const Dashboard: React.FC = () => {
  return (
    <div className="layout">
      <div className="layout-content">
        <main className="main-content">
          <div className="center-content imgMuni">
            <h1 className="display-3">Mi Muni en Línea</h1>
            <img src="src/assets/LogoGeoRedes.png" alt="Logo" />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
