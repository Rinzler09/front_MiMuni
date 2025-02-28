import axios from "axios";
import { toast } from "sonner";

const API_URL = "http://localhost:3000/api/v1/login/usuario";

// Función para iniciar sesión
export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(API_URL, { email, password });
    console.log("Full Response Data:", response.data);
    const { status, message } = response.data;

    // Verifica si la contraseña es temporal basándose en el mensaje del backend
    if (message.toLowerCase().includes("contraseña temporal")) {
      toast.info("Contraseña temporal correcta."); // Muestra un mensaje indicando que la contraseña es temporal
      return {
        success: true,
        isTemporaryPassword: true, // Marca como contraseña temporal
        message,
      };
    }

    // Si no es una contraseña temporal, muestra un mensaje de éxito
    toast.success(message);
    return {
      success: true,
      isTemporaryPassword: false, // No es una contraseña temporal
      message,
    };
  } catch (error: any) {
    console.error("Login Error:", error);
    // Extrae el mensaje del backend o usa un mensaje por defecto
    const errorMessage = error.response?.data?.message || "Credenciales incorrectas";
    // Muestra el mensaje de error
    toast.error(errorMessage);
    return {
      success: false,
      message: errorMessage,
    };
  }
};
