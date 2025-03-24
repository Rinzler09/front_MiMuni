import { toast } from "sonner";
import auth from "../Auth/auth";

const API_URL = "/login/usuario";

interface LoginResponse {
  message: string;
  user: any;
  access_token?: string;
  municipalidades?: string;
 
}

interface LoginResult {
  success: boolean;
  message: string;
  isTemporaryPassword?: boolean;
  correo?: any;
  access_token?: string;
  municipalidades?: string;
  
}

export const login = async (email: string, password: string): Promise<LoginResult> => {
  try {
    const response = await auth.post<LoginResponse>(API_URL, { email, password });
    console.log("Full Response Data:", response.data);

    const { message, user, access_token, municipalidades } = response.data;
    console.log("token:", access_token);
    console.log("MUNICIPALIDAD:", municipalidades);
    console.log("Usuario:", user);
  

    if (message.toLowerCase().includes("credenciales incorrectas")) {
      toast.error(message);
      return {
        success: false,
        message,
      };
    }

    if (message.toLowerCase().includes("contraseña temporal")) {
      toast.info("Contraseña temporal correcta.");
      return {
        success: true,
        isTemporaryPassword: true,
        correo: user,
        message,
        access_token,
        
      };
    }

    toast.success(message);

    return {
      success: true,
      isTemporaryPassword: false,
      correo: user,
      message,
      municipalidades,
      access_token,
    };
  } catch (error: any) {
    console.error("Login Error:", error);
    const errorMessage = error.response?.data?.message || "Credenciales incorrectas";
    //toast.error(errorMessage);
    return {
      success: false,
      message: errorMessage,
    };
  }
};