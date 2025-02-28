import axios from "axios";

const API_URL = "http://localhost:3000/api/v1/activacion/activarUser";
//const API_URL = "https://apex.oracle.com/pls/apex/pruebauni/apiSolicitud/postSolicitud/";

// Función para registrar un usuario
export const registrarSolicitud = async (nombre: string, identidad: string, registrotributario: string, email: string, telefono: string) => {
  try {
    const response = await axios.post(API_URL, {
      nombre, identidad, registrotributario, email, telefono
    });
    return response.data; // Devuelve los datos del usuario registrado
  } catch (error: any) {
    throw new Error( error.response?.data?.message || "Error al registrar solicitud, estamos trabajando para solucionar este inconveniente"
    );
  }
};
