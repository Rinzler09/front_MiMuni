import { toast } from "sonner";
import auth from "../Auth/auth";
import { mensajes } from "../util/message";

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

// Función para interpretar el mensaje del backend y devolver un mensaje amigable y el tipo (success, error o info)
const interpretarMensaje = (
  mensajeBackend: string
): { mensaje: string; tipo: "success" | "error" | "info" | "post" } => {
  const mensaje = mensajeBackend.toLowerCase();
  for (const key in mensajes) {
    if (mensaje.includes(key)) {
      return mensajes[key];
    }
  }
  // Si no coincide con ningún mapeo, se retorna el mensaje original como éxito
  return { mensaje: mensajeBackend, tipo: "success" };
};


export const login = async (email: string, password: string): Promise<LoginResult> => {
  try {
    
    const response = await auth.post<LoginResponse>(API_URL,{ email, password },
      {
        validateStatus: (status) => status >= 200 && status < 500,
      }
    );

    // Si el servidor respondió con 401, lo manejamos como "credenciales inválidas"
    if (response.status === 401) {
      toast.error(mensajes["credenciales incorrectas"].mensaje);
      return {
        success: false,
        message: mensajes["credenciales incorrectas"].mensaje,
      };
    }
    

    const { message, user, access_token, municipalidades } = response.data;
    const {mensaje, tipo} = interpretarMensaje(message.toLowerCase());
    // Manejo de mensajes específicos devueltos por el backend
    if (tipo === "error") {
    //  toast.error(mensajes[message].mensaje);
     toast.error(mensaje);
      return {
        success: false,
        message,
      };
    }

    if (tipo === "info") {
     // toast.info("Contraseña temporal correcta.");
     toast.info(mensaje);
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
   
   // console.error("Login Error:", error);
    const errorMessage = error.response?.data?.message || "Credenciales Incorrectas";
    return {
      success: false,
      message: errorMessage,
    };
  }
};