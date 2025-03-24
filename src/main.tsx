import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import "../src/main.css";
import { AuthProvider } from "./Auth/AuthContex";
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <AuthProvider>  
    <StrictMode>
    <App />
  </StrictMode>,
  </AuthProvider>

)
