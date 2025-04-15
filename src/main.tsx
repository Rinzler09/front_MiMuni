import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../src/main.css";
import { AuthProvider } from "./Auth/AuthContex";
import App from './App.tsx';
import InactivityHandler from '../src/Auth/interactividad.tsx';
import * as Sentry from '@sentry/react';

// Inicialización de Sentry
Sentry.init({
  dsn: "https://4219a2cd802d70977e303430971dea3b@o4509112803065856.ingest.us.sentry.io/4509112924307456",
  integrations: [
    Sentry.browserTracingIntegration()
  ],
  tracesSampleRate: 1.0,
  tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/]
});

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <StrictMode>
      <Sentry.ErrorBoundary fallback={<p>Algo salió mal. Por favor, recarga la página.</p>}>
        <InactivityHandler>
          <App />
        </InactivityHandler>
      </Sentry.ErrorBoundary>
    </StrictMode>
  </AuthProvider>
);
