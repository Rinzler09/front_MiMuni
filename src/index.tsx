// index.tsx

import { createRoot } from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './main.css';
// Inicializa Sentry lo antes posible


createRoot(document.getElementById('root')!).render(
  // Se envuelve toda la aplicación con ErrorBoundary para capturar errores

  //  Se comento esta linea para probar si es la causante de que el Login no cargue bien tras cerrar sesion 
  // <Sentry.ErrorBoundary fallback={<p>Algo salió mal. Por favor, recarga la página.</p>}>
    <App />


);
