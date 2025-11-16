import auth from "../Auth/auth";

const API_URL = "/activacion/setPrimaryEmail";


//Funcion para establecer correo principal
export const registrarCorreoPrincipal = async (identidad: string, registrotributario: string, correoprincipal: string) => {
    try {

        const response = await auth.post(API_URL, {
            identidad, registrotributario, correoprincipal
        });
        return response.data
    } catch (error: any) {
        throw new Error(error.response?.data?.message)
    }
}