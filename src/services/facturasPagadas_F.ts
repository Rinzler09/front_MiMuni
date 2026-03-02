import auth from "../Auth/auth";

const API_URL = "/facturasPag/parametrizada";

export const facturasPagadas_F = async (
    municipalidad: string,
    tipoImpuesto: string,
    fechaInicio: string,
    fechaFin: string,
    claveCat: string | null,
    token: string | null
) => {
    try {
        const response = await auth.get(
            API_URL,
            {//se envuelven los headers y los params en un solo objeto ya que para el metodo HTTP GET no es recomendado enviar un Body (query string)
                params: { municipalidad, tipoImpuesto, fechaInicio, fechaFin, claveCat },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response?.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data.message || "No se encontraron facturas pagadas."
        );
    }
};