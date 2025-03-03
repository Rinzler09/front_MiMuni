import axios from "axios";
import { toast } from "sonner";

const API_URL = "http://localhost:3000/api/v1/login/usuario";

// Función para iniciar sesión
export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(API_URL, { email, password });
    console.log("Full Response Data:", response.data);
    const { status, message } = response.data;

    // Verifica si el mensaje indica credenciales incorrectas
    if (message.toLowerCase().includes("credenciales incorrectas")) {
      toast.error(message);
      return {
        success: false,
        message,
      };
    }

    // Verifica si la contraseña es temporal basándose en el mensaje del backend
    if (message.toLowerCase().includes("contraseña temporal")) {
      toast.info("Contraseña temporal correcta.");
      return {
        success: true,
        isTemporaryPassword: true,
        message,
      };
    }

    // Si la respuesta es de éxito y no es una contraseña temporal
    toast.success(message);
    return {
      success: true,
      isTemporaryPassword: false,
      message,
    };
  } catch (error: any) {
    console.error("Login Error:", error);
    const errorMessage = error.response?.data?.message || "Credenciales incorrectas";
    toast.error(errorMessage);
    return {
      success: false,
      message: errorMessage,
    };
  }
};
;
