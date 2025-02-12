import axios from "axios";

const API_URL = "http://localhost:3000/api/v1/clavecata/get";

// Función para claves catastrales
export const clavesCatastrales = async (username: any) => {
    // console.log("ESTOY EN TS PARA SALIR AL BACK", username);
    try {
        const response = await axios.get(API_URL, {
            headers: {
                userName: username,
            },
        });

        return response.data; // Devuelve los datos del usuario autenticado

    } catch (error: any) {
        throw new Error(
            error.response?.data?.message ||
            "Error al importar datos de tabla"
        );
    }
};
