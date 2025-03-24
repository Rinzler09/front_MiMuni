import axios, {AxiosRequestConfig, AxiosInstance, AxiosResponse, AxiosError}  from "axios";

//Extendemos la configuracion de Axios para incluir una bandera
interface CustomAxiosRequestConfig extends AxiosRequestConfig{
    _retry?: boolean;
    iat: number;
}

const auth: AxiosInstance = axios.create({
    baseURL: (import.meta.env.VITE_API_URL),
    withCredentials: true, //Esto nos ayudara que permite el envio y recepcion de cookies (Incluye el refresh token)

});

auth.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => response,
    async (error: AxiosError): Promise<any> => {
      console.log("Interceptor - Error capturado:", error);
      const originalRequest = error.config as CustomAxiosRequestConfig;
  
      if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        console.log("Token expirado, intentando reintentar petición para refrescar el token...");
        try {
          const response = await auth(originalRequest);
          console.log("Reintento exitoso, se debió actualizar la cookie httpOnly.");
          return response;
        } catch (refreshError) {
          console.error("Error al refrescar el token:", refreshError);
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );
  
  

export default auth;