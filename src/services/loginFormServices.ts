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
  access_token?: string
  municipalidades?: string;
  
}

export const login = async (email: string, password: string): Promise<LoginResult> => {
  try {
    
    const response = await auth.post<LoginResponse>(API_URL,{ email, password },
      {
        validateStatus: (status) => status >= 200 && status < 500,
      }
    );

    // Si el servidor respondió con 401, lo manejamos como "credenciales inválidas"
    if (response.status === 401) {
      toast.error("Credenciales incorrectas");
      return {
        success: false,
        message: "Credenciales incorrectas",
      };
    }

    // Opcional: logs de depuración
    console.log("Full Response Data:", response.data);
    console.log("Response Data:", auth);

    const { message, user, access_token, municipalidades } = response.data;

    // Manejo de mensajes específicos devueltos por el backend
    if (message.toLowerCase().includes("credenciales incorrectas")) {
    //  toast.error(message);
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

    // Si todo va bien, mostramos el mensaje y retornamos el resultado
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
    // Aquí solo entrarías si ocurre un error de red, 500, etc. (≥ 500)
    console.error("Login Error:", error);
    const errorMessage = error.response?.data?.message || "Credenciales Incorrectas";
    // Si prefieres, puedes mostrar un toast aquí:
    // toast.error(errorMessage);
    return {
      success: false,
      message: errorMessage,
    };
  }
};
