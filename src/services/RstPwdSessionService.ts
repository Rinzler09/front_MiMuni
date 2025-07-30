import auth from "../Auth/auth"

const API_URLCONTRA_SS = "/resetPwdSession";


//Configuracion para el endpoint de cambio de contraseña ya logeado
export const resetPwdSessionService = async (contrasenaAnterior: string, nuevaContrasena: string, repetirContrasena: string, token: string) => {
    if (nuevaContrasena === repetirContrasena) {
        const payloadMML = {
            "new_psswd": nuevaContrasena,
            "old_psswd": contrasenaAnterior
        };

        try {
            //Aqui ira toda la logica para poder enviar la solicitud necesaria al backend de Milton.
            const response = await auth.post(
                API_URLCONTRA_SS,
                payloadMML,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data.message);
        }
    } else {
        throw new Error("La nueva contraseña no coincede con el valor de repetir nueva contraseña, no se puede actualizar. ");
    }

}