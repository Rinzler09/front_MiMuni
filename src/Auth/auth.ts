import axios, {
  AxiosRequestConfig,
  AxiosInstance,
  AxiosResponse,
  AxiosError,
} from "axios";

// Extendemos la configuración de Axios para incluir una bandera
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
  iat: number;
}

const auth: AxiosInstance = axios.create({
  baseURL: (`${import.meta.env.VITE_API_URL}`), 
  withCredentials: true, // Permite el envío y recepción de cookies 

});

auth.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: AxiosError): Promise<any> => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (originalRequest.url?.includes("/login/usuario")) {
      // Puedes manejar el error en el catch de la función login sin loggear
      return Promise.reject(error);
    }

    // Si el error es 401 y no es la petición de login, intenta refrescar el token
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      //console.log("Token expirado, intentando reintentar petición para refrescar el token...");

      try {
        const response = await auth(originalRequest);//actualiza el httpOnly cookie 
        return response;
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);


export default auth;
