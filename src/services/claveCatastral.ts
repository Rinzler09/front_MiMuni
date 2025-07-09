import auth from "../Auth/auth";

const API_URL = "/bienesInmuebles/BIxUser";

export const clavesCatastrales = async (municipalidad: string, token: string | null) => {
  try {
    const response = await auth.post(
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
      error.response?.data?.message || "Facturas no encontradas para este Bien Inmueble"
    );
  }
};
