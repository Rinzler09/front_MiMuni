import auth from "../Auth/auth";

const API_URL = "/facturasPag/consulta";

export const facturasPagadas = async (
    municipalidad: string,
    token: string | null
) => {
    try {
        const response = await auth.post(
            API_URL,
            { municipalidad },
            {
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