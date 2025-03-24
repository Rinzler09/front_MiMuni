import axios from "axios";

const API_URL = "http://localhost:3000/api/v1/bienesInmuebles/BIxUser";

export const clavesCatastrales = async (municipalidad: string, token: string) => {
  try {
    const response = await axios.post(
      API_URL,
      { municipalidad }, // body
      {
        headers: {
          Authorization: `Bearer ${token}`, // el Bearer Token
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error al importar datos de tabla"
    );
  }
};
