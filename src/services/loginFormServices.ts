//Codigo Revisado por MP
import { toast } from "sonner";
import auth from "../Auth/auth";
import { mensajes } from "../util/message";
import { MdCheckCircle } from 'react-icons/md';
import React from "react";

const API_URL = "/login/usuario";

interface LoginResponse {
  message: string;
  user: any;
  municipalidades?: string[];
  identificador?: string;
}

interface LoginResult {
  success: boolean;
  message: string;
  isTemporaryPassword?: boolean;
  correo?: any;
  access_token?: string;
  municipalidades?: string[];
  dni?: string;
}

const interpretarMensaje = ( //esta funcion se usa para mandar mostrar mensajes al frontend segun los mensajes que vienen del backend ya que no se puede mostrar el mismo mensaje
  mensajeBackend: string
): { mensaje: string; tipo: string } => {
  const clave = mensajeBackend.toLowerCase();
  for (const key in mensajes) {
    if (clave.includes(key)) {
      return mensajes[key];
    }
  }
  return { mensaje: mensajeBackend, tipo: "success" };
};

export const login = async ( //funcion login la cual sirve para validar credenciales
  email: string,
  password: string
): Promise<LoginResult> => {
  try {
    const response = await auth.post<LoginResponse>(
      API_URL, //endpoint por el cual se consume la API
      { email, password }, //payload
      { validateStatus: (s) => s >= 200 && s < 500 } //opcion para validar estados
    );

    //obtengo el token y el tipo de la respuesta
    const [type, token] = response.headers.authorization?.split(' ') ?? [];
    const acc_TKN = type === 'Bearer' ? token : undefined; // si el tipo es Bearer entonces el valor de token pasa a acc_TKN
    //console.log("Este es el type: ", type);
    //console.log("Este es el token: ", acc_TKN);


    // Si 401, credenciales inválidas
    if (response.status === 401) {
      toast.error(mensajes["credenciales incorrectas"].mensaje);
      return {
        success: false,//parametro que si es true se utiliza para establecer datos iniciales en hook de usuario
        message: mensajes["credenciales incorrectas"].mensaje, //se utiliza la llave para obtener el valor del objeto mensajes 
      };
    }

    // Desestructura body de la respuesta del backend
    const { message, user, municipalidades, identificador } = response.data;
    const { mensaje, tipo } = interpretarMensaje(message); //se obtiene el mensaje y se desestructura del diccionario el mensaje y el tipo

    if (tipo === "error") {//en caso que el tipo en el diccionario sea un error
      toast.error(mensaje);
      return { success: false, message };
    }

    if (tipo === "infoPwdTemporal") { // En caso de que este intentando activar cuenta con contra temporal
      toast.info(mensaje);
      return {
        success: true, isTemporaryPassword: true, correo: user, message, access_token: acc_TKN,
      };
    }

    // En caso de que el login sea exitoso entonces se personaliza un toast y 
    // se devuelve un objeto al TSX
    toast.success(mensajes['Tus credenciales son correctas.']?.mensaje || 'Tus credenciales son correctas.', {
      description: '¡Bienvenido de nuevo!',
      icon: React.createElement(MdCheckCircle, { style: { color: "green", fontSize: "1.2em" } })
    })
    return {
      success: true,
      isTemporaryPassword: false,
      correo: user,
      message,
      municipalidades,
      dni: identificador,
      access_token: acc_TKN,
    };
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Credenciales Incorrectas";
    return { success: false, message: errorMessage };
  }
};