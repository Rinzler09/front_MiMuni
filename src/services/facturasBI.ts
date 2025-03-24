import auth from "../Auth/auth";

const API_URL = "/facturasBI/consulta";

export const facturaBienesInmueble = async (
  municipalidad: string,
  claveCat: string,
  //direccion: string,
  token: string
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
      error.response?.data.message || "Error al importar datos de tabla"
    );
  }
};
