import auth, {setAuthToken} from "../Auth/auth";
import type { AxiosResponseHeaders } from "axios";


//Declaramos las variables que contiene la URL del endpoint
const API_URL = "/resetPwd/chkEmail";
const API_URlCODIGO = "/resetPwd/validateOTP";
const API_URLCONTRA = "/resetPwd/rstpwd";
const API_CAMBIOCONTRA = "";



//Con esta funcion enviamos el correo con el codigo
export const correoRecuperacionContrasenia = async (email:string) =>{
    try {
        const response = await auth.post(
            API_URL,
            {email},
        );
        return response.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || "Correo no encontrado"
        );
    }
};

//En esta funcion verificaremos si el codigo es autentico
export const verificacioCodigoServices = async (email: string, otp:string): Promise<any> =>{
    try {
        const response = await auth.post(
            API_URlCODIGO,
            {email, otp},
        );

        //Extraemos el token del OTP
        const authHeader =  response.headers["authorization"] || response.headers["Authorization"] || response.headers["x-access-token"] || "";
        if (authHeader) {
            const newToken = authHeader.startsWith("Bearer") ? authHeader.slice(7): authHeader;
            //console.log("VerificacionOTP token recibido en header", newToken);
            setAuthToken(newToken);
        }
        return response.data
    } catch (error: any) {
        throw new Error(
            error.response?.data.message || "El codigo es invalido o ha expirado"
        );
    }
}

// Configuracion para el endpoint de cambio de contraseña
export const receteoContraServices = async (n_psswd:string, token:string) =>{
    try {
        const response = await auth.post(
            API_URLCONTRA,
            {n_psswd},
            {
                headers: {
                    //Se puede ajustar otro tipo de headers si es neceario
                    Authorization: `Bearer ${token}`,
                }
            }
        );
        const headers = response.headers as AxiosResponseHeaders;
        const viaGet = headers.get("authorization") ?? headers.get("Authorization");
        return response.data;
    } catch (error: any) {
        throw new Error(
            error.response?.message || "La Contraseña no se puede cambiar"
        );
        
    }
}

//Configuracion para el endpoint de cambio de contraseña ya logeado
export const cambioContraseniaServices = async(contraseñaAnterior: string, nuevaContraseña: string, repetirContraseña: string) =>{
    try {
        //Aqui ira toda la logica para poder enviar la solicitud necesaria al backend de Milton.
    } catch (error) {
        
    }
}