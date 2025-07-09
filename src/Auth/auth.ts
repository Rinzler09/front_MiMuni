// src/Auth/auth.ts
import axios, {
  AxiosRequestConfig,
  AxiosInstance,
  AxiosResponse,
  AxiosError,
} from "axios";


// Variable interna para mantener el token en este módulo
let access_token: string | null = null;//se define que sera let ya que estara cambiando dinamicamente

// Lista de callbacks que se llamarán cuando cambie el token
type TokenSubscriber = (token: string | null) => void;
const tokenSubscribers: TokenSubscriber[] = [];

/**
  Llama a todos los suscriptores con el nuevo token

  En práctica, esto permite que desde distintos puntos de la aplicación (hooks, servicios, componentes) se subscriba
  con subscribeAuthToken(cb) y asi la app automáticamente se entere cuando alguien invoque setAuthToken con un token nuevo o null. 
  De este modo se mantiene sincronizado el estado del token en toda la app sin acoplar directamente modulos entre sí.

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
  access_token = token; //se guarda el token en memoria 
  if (token) {
    // console.log("El token siguen guardado en Session storage");
    sessionStorage.setItem("access_TKN", token);//se guarda el token en el sessionStorage de igual forma por si se recarga la pagina
  } else {
    console.log("Removio el accesstoken del session storage");
    sessionStorage.removeItem("access_TKN");// para que cuando setAuthToken sea null tambien se destruya la clave en memoria del session storage
  }
  notifyTokenSubscribers(token);
}

/**
 * Getter sencillo si en algún momento lo necesitas
 */
export function getAuthToken(): string | null {
  access_token = sessionStorage.getItem("access_TKN");//Este valor se obtiene del session storage 
  // ya que el valor de access_token del setter para el access token se guarda en memoria y al recargar se pierde
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

//Interceptor de petición: añade Authorization si tenemos token
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
    // if (error.response?.status === 401 && !originalRequest._retry) {
    //   originalRequest._retry = true;
    //   originalRequest.withCredentials = true;

    //   try {
    //     return await auth.request(originalRequest);
    //   } catch (err) {
    //     return Promise.reject(err);
    //   }
    // }

    return Promise.reject(error);
  }
);

export default auth;
