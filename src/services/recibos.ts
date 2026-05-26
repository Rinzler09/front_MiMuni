import auth from "../Auth/auth";

const API_URL = "/recibosPDF/pagados";

export const recibos = async (
    numRecibo: string,
    municipalidad: string | null,
    token: string | null
) => {
    try {
        const response = await auth.get(
            API_URL, {
            responseType: 'blob',
            params: { pdfID: numRecibo, muni: municipalidad },
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
