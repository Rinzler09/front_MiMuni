// index.tsx

import { createRoot } from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './main.css';
// Inicializa Sentry lo antes posible


createRoot(document.getElementById('root')!).render(
  // Se envuelve toda la aplicación con ErrorBoundary para capturar errores
   <App />
   
    
   
);
