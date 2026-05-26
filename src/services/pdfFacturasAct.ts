import auth from "../Auth/auth";

const API_URL = "/recibosPDF/factActivas";

export const pdfFacturasAct = async (
    numRecibo: string,
    municipalidad: string | null,
    clave: string,
    token: string | null
) => {
    try {
        const response = await auth.get(
            API_URL, {
            responseType: 'blob',
            params: { pdfID: numRecibo, muni: municipalidad, claveCatastral: clave },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
        );

        return response;

    } catch (error: any) {
        throw new Error("Ocurrio un error al cargar el recibo");
    }
}
