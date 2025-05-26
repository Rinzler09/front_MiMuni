// src/Auth/auth.ts
import axios, {
  AxiosRequestConfig,
  AxiosInstance,
  AxiosResponse,
  AxiosError,
} from "axios";

// Variable interna para mantener el token en este módulo
let access_token: string | null = null;

// Lista de callbacks que se llamarán cuando cambie el token
type TokenSubscriber = (token: string | null) => void;
const tokenSubscribers: TokenSubscriber[] = [];

/**
 * Llama a todos los suscriptores con el nuevo token
 */
function notifyTokenSubscribers(token: string | null) {
  for (const cb of tokenSubscribers) {
    try {
      cb(token);
    } catch {
      // Ignoramos errores en callbacks individuales
    }
  }
}

/**
 * Setter global del token para Axios y también notifica suscriptores
 */
export function setAuthToken(token: string | null) {
  access_token = token;
  notifyTokenSubscribers(token);
  console.log("Token desde auth.ts:", token);
}

/**
 * Getter sencillo si en algún momento lo necesitas
 */
export function getAuthToken(): string | null {
  return access_token;
}

export function subscribeAuthToken(cb: TokenSubscriber): () => void {
  tokenSubscribers.push(cb);
  return () => {
    const idx = tokenSubscribers.indexOf(cb);
    if (idx !== -1) tokenSubscribers.splice(idx, 1);
  };
}

// Extendemos la configuración de Axios para incluir nuestra bandera de retry
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const auth: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Interceptor de petición: añade Authorization si tenemos token
auth.interceptors.request.use(
  (config) => {
    if (access_token) {
      config.headers = config.headers ?? {};
      (config.headers as Record<string, string>)["Authorization"] =
        `Bearer ${access_token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Interceptor de respuestas: manejo de 401 con retry
auth.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // Evitar retry en login
    if (originalRequest.url?.includes("/login/usuario")) {
      return Promise.reject(error);
    }

    // Retry único en caso de 401
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      originalRequest.withCredentials = true;

      try {
        return await auth.request(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default auth;
