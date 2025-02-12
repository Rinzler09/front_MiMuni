import axios from "axios";

// const API_URL = "http://localhost:3000/api/v1/usuario";
const API_URL = "http://localhost:3000/api/v1/usuario";

// Función para iniciar sesión
export const login = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      username,
      password,
    });
    // Devuelve los datos del usuario autenticado
    console.log("Response Data:", response.data.usuario.usuarioname);
    localStorage.setItem("usuario", JSON.stringify(response.data.usuario.usuarioname));
    return response.data; // Devuelve los datos del usuario autenticado
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
      "Error al iniciar sesión, estamos trabajando para solucionar este incoveniente"
    );
  }
};

// Función para cerrar sesión (opcional)
export const logout = () => {
  localStorage.removeItem("user"); // Elimina el usuario del localStorage
};
