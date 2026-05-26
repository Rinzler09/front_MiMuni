// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../src/main.css';
import { AuthProvider } from './Auth/AuthContext';
import App from './App';

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <AuthProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </AuthProvider>
);
