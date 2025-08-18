// App.tsx

import "@fortawesome/fontawesome-free/css/all.min.css";
import AppRoutes from "./routes/AppRoutes";
import "./style/PagesStyles/loginFormStyles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
const App: React.FC = () => {
  

  return (
    <div className="App">
      <AppRoutes />
     
    </div>
    
  );
};

export default App;
