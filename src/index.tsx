// index.tsx

import { createRoot } from 'react-dom/client';
import App from './App';
import * as Sentry from '@sentry/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './main.css';

// Inicializa Sentry lo antes posible
Sentry.init({
  dsn: "https://4219a2cd802d70977e303430971dea3b@o4509112803065856.ingest.us.sentry.io/4509112924307456",
  integrations: [
    Sentry.browserTracingIntegration()
  ],
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/]
});

createRoot(document.getElementById('root')!).render(
  // Se envuelve toda la aplicación con ErrorBoundary para capturar errores

  //  Se comento esta linea para probar si es la causante de que el Login no cargue bien tras cerrar sesion 
  <Sentry.ErrorBoundary fallback={<p>Algo salió mal. Por favor, recarga la página.</p>}>
    <App />
  </Sentry.ErrorBoundary>

);
