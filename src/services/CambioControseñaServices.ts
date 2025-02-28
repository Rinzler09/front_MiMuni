import axios from "axios";

// URL de la API
const API_URL = "http://localhost:3000/api/v1/login/changePassword";

// Función para cambiar contraseña
export const cambiarContra = async (n_psswd: string,) => {
  try {
    // Obtén el correo electrónico de localStorage
    const email = localStorage.getItem("correo");
    const o_psswd = localStorage.getItem("cotraseñ temporal");
    if (!email) {
      throw new Error("No se encontró un correo electrónico en localStorage.");
    }

    // Envía el correo y la contraseña
    const response = await axios.post(API_URL, {
      email: email.replace(/"/g, ""), // email 
      n_psswd, // Nueva contraseña
      o_psswd, // Contraseña temporal
    });

    return response.data; // Devuelve la respuesta del backend
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        "Error al actualizar contraseña. Estamos trabajando para solucionar este inconveniente."
    );
  }
};  