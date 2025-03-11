import axios from 'axios';
import { Toast } from 'react-bootstrap';
import { toast } from 'sonner';

const API_URL = "http://localhost:3000/api/v1/login/usuario";
// Función para iniciar sesión
export const LoginRequest = async (email: string, password: string) => {
  try {
    const response = await axios.post(API_URL, {email,password});
    const {message, access_token, user} = response.data;
    toast.success(message || "Inicio de sesión exitoso");
    return response;
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    throw error;
  }
}
