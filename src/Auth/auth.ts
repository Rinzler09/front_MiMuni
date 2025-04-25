import axios, {
  AxiosRequestConfig,
  AxiosInstance,
  AxiosResponse,
  AxiosError,
} from "axios";

// Extendemos la configuración de Axios para incluir nuestra bandera de retry
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const auth: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
  withCredentials: true,                  
});

// Interceptor de respuestas
auth.interceptors.response.use(
  // 1) En caso de éxito, simplemente devolvemos la respuesta
  (response: AxiosResponse) => response,

  // 2) En caso de error, manejamos 401 y hacemos retry una sola vez
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // a) No intentamos retry sobre el login para evitar bucles
    if (originalRequest.url?.includes("/login/usuario")) {
      return Promise.reject(error);
    }

    // b) Si recibimos 401 y aún no hemos hecho retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      originalRequest.withCredentials = true;

      try {
        // Reintentamos la misma petición; el backend debe auto-refrescar el token
        return await auth.request(originalRequest);
      } catch (err) {
        // Si vuelve a fallar, simplemente propaga el error
        return Promise.reject(err);
      }
    }

    // c) Para cualquier otro error, lo propagamos
    return Promise.reject(error);
  }
);

export default auth;
