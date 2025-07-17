import auth, { setAuthToken } from "../Auth/auth";
import type { AxiosResponseHeaders } from "axios";
import { useAuth } from "../Auth/AuthContext";


//Declaramos las variables que contiene la URL del endpoint
const API_URL = "/resetPwd/chkEmail";
const API_URlCODIGO = "/resetPwd/validateOTP";
const API_URLCONTRA = "/resetPwd/rstpwd";



//Con esta funcion enviamos el correo con el codigo
export const correoRecuperacionContrasenia = async (email: string) => {
    try {
        const response = await auth.post(
            API_URL,
            { email },
        );
        return response.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || "Correo no encontrado"
        );
    }
};

//En esta funcion verificaremos si el codigo es autentico

export const verificacioCodigoServices = async (email: string, otp: string, setTokenOT: (t: string) => void): Promise<any> => {

    try {
        const response = await auth.post(
            API_URlCODIGO,
            { email, otp },
        );

        //Extraemos el token del OTP
        const authHeader = response.headers["authorization"] || response.headers["Authorization"] || response.headers["x-access-token"] || "";
        if (authHeader) {
            const newToken = authHeader.startsWith("Bearer") ? authHeader.slice(7) : authHeader;
            console.log("VerificacionOTP token recibido en header", newToken);//estas obteniendo el token de forma correcta BACATLAN
            //setAuthToken(newToken);//este hook es especifico para auth.ts ya que se debe guardar en memoria tambien el token y en auth.ts se guarda en memoria
            setTokenOT(newToken);//se usa el hook de contexto el que se define en AuthContext para que el nuevo token sea guardado
            // directamente en ese mismo estado - se caracteriza porque al guardar el token usando useSessionStorage se guarda con ""
            //console.log("El token que se establecio en el OTP, ", newToken); si se esta estableciendo bien
        }

        return response.data
    } catch (error: any) {
        console.log("Hubo un error en verificacioCodigoServices: ", error);
        throw new Error(
            error.response?.data.message || "Codigo invalido"
        );
    }
}

// Configuracion para el endpoint de cambio de contraseña
export const receteoContraServices = async (n_psswd: string, token: string) => {
    try {
        const response = await auth.post(
            API_URLCONTRA,
            { n_psswd },
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

