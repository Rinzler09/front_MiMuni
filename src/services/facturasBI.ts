import auth from "../Auth/auth";

const API_URL = "/facturasBI/consulta";

export const facturaBienesInmueble = async (
  municipalidad: string,
  claveCat: string,
  token: string | null
) => {
  try {
    const response = await auth.post(
      API_URL,
      { municipalidad, claveCat },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data.message || "Facturas no encontradas para este Bien Inmueble"
    );
  }
};
