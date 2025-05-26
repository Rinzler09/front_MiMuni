// src/services/EliminacionCookie.ts
import auth from "../Auth/auth";

const API_URL = "/logout/usuario";

/**
 * Recibe el token en memoria y lo manda en el header.
 * El body va null, la config (headers) va en tercer parámetro.
 */
export const logoutUsuario = async (token: string): Promise<any> => {
  try {
    const response = await auth.post(
      API_URL,
      null,                // <— body vacío
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Logout API error:", error);
    throw new Error("Error al cerrar sesión");
  }
};
