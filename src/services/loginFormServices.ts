import axios from "axios";
import { toast } from "sonner";

const API_URL = "http://10.169.101.83:3000/api/v1/login/usuario";

// Función para iniciar sesión
export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(API_URL, { email, password });
    console.log("Full Response Data:", response.data);

    // Desestructuramos 'status', 'message' y 'token' (asumiendo que el backend lo envía)
    const { status, message, access_token, user } = response.data;

    // Muestra el token completo en consola
    console.log("Usuario:", user);

    // Verifica si el mensaje indica credenciales incorrectas
    if (message.toLowerCase().includes("credenciales incorrectas")) {
      toast.error(message);
      return {
        success: false,
        message,
      };
    }

    // Verifica si la contraseña es temporal
    if (message.toLowerCase().includes("contraseña temporal")) {
      toast.info("Contraseña temporal correcta.");
      return {
        success: true,
        isTemporaryPassword: true,
        auth_token: access_token, // Retornamos el token real
        correo: user,
        message,
      };
    }

    // Si la respuesta es de éxito y no es contraseña temporal
    toast.success(message);
    return {
      success: true,
      isTemporaryPassword: false,
      auth_token: access_token, // Retornamos el token real
      correo: user,
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
