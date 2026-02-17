import auth from "../Auth/auth";

const API_URL = "/activacion/activarUser";

// Función para registrar un usuario
export const registrarSolicitud = async ( dni: string,  rtn: string, email: string, telefono: string) => {
  try {
    const response = await auth.post(API_URL, {
       dni, rtn, email, telefono
    });
    return response.data; // Devuelve los datos del usuario registrado
  } catch (error: any) {
    throw new Error( error.response?.data?.message || "Error al registrar solicitud, estamos trabajando para solucionar este inconveniente"
    );
  }
};
