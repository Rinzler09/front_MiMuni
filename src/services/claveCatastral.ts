import axios from "axios";

const API_URL = "http://10.169.101.83:3000/api/v1/clavecata";

// Función para claves catastrales
export const clavesCatastrales = async (username: any) => {
    // console.log("ESTOY EN TS PARA SALIR AL BACK", username);
    const token = localStorage.getItem("access_token");
    try {
        const response = await axios.get(API_URL, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        return response.data; // Devuelve los datos del usuario autenticado

    } catch (error: any) {
        throw new Error(
            error.response?.data?.message ||
            "Error al importar datos de tabla"
        );
    }
};
