import React from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import AppRoutes from "./routes/AppRoutes";
import './style/PagesStyles/login.css';
import "bootstrap/dist/css/bootstrap.min.css";

const App: React.FC = () => {
  return (
    <div className="App">
      <AppRoutes />
    </div>
  );
};

export default App;
