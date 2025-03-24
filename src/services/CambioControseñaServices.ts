import axios from "axios";

// URL de la API
const API_URL = "http://localhost:3000/api/v1/login/changePassword";

// Función para cambiar contraseña
export const cambiarContra = async (n_psswd: string) => {
  try {
    // Obtén el correo electrónico y la contraseña vieja desde localStorage
    const email = localStorage.getItem("email");
    const o_psswd = localStorage.getItem("password");

    // Obtén el token (si tu backend lo requiere)
    const token = localStorage.getItem("token");

    if (!email) {
      throw new Error("No se encontró un correo electrónico en localStorage.");
    }

    // Construimos el payload a enviar
    const payload = {
      email: email.replace(/"/g, ""), // elimina comillas en caso de que existan
      n_psswd, // Nueva contraseña
      o_psswd, // Contraseña temporal / vieja
    };

    // Realiza la petición al backend con los headers que incluyan el token
    const response = await axios.post(API_URL, payload, {
      headers: {
        // Ajusta si tu backend requiere otro tipo de encabezado
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data; // Devuelve la respuesta del backend
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        "Error al actualizar contraseña. Estamos trabajando para solucionar este inconveniente."
    );
  }
};
