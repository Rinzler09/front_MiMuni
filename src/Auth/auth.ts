// src/Auth/auth.ts

import axios, { AxiosInstance, AxiosError, AxiosResponse } from "axios";

let accessToken: string | null = null;
type TokenSubscriber = (token: string | null) => void;
const subscribers: TokenSubscriber[] = [];

/**
 * Notifica a todos los suscriptores que el token ha cambiado.
 */
function notifySubscribers(token: string | null) {
  for (const cb of subscribers) {
    try {
      cb(token);
    } catch {
      console.error("Error al notificar a un suscriptor de token");
    }
  }
}

/**
 * Inicializa el accessToken desde sessionStorage.
 */
(function initTokenFromStorage() {
  const raw = sessionStorage.getItem("Token");
  if (raw) {
    try {
      accessToken = JSON.parse(raw);
    } catch {
      accessToken = null;
    }
  }
  // Notificamos una vez a los suscriptores que haya
  notifySubscribers(accessToken);
})();

/**
 * Asigna un nuevo token, lo persiste y notifica a los suscriptores.
 */
export function setAuthToken(token: string | null) {
  accessToken = token;

  if (token) {
    sessionStorage.setItem("Token", JSON.stringify(token));
  } else {
    sessionStorage.removeItem("Token");
  }

  notifySubscribers(token);
}

/**
 * Devuelve el token actual (puede ser null).
 */
export function getAuthToken(): string | null {
  return accessToken;
}

/**
 * Registra un callback que se ejecutará cada vez que cambie el token.
 * Devuelve una función para desuscribirse.
 */
export function subscribeAuthToken(cb: TokenSubscriber): () => void {
  subscribers.push(cb);
  // Llamamos inmediatamente con el valor actual:
  cb(accessToken);
  return () => {
    const idx = subscribers.indexOf(cb);
    if (idx !== -1) subscribers.splice(idx, 1);
  };
}

const auth: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Interceptor de petición: añade Authorization si hay token
auth.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers = config.headers ?? {};
      (config.headers as Record<string, string>)["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

auth.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalReq = error.config as { _retry?: boolean; url?: string };

    // No reintentar en login
    if (originalReq.url?.includes("/login/usuario")) {
      return Promise.reject(error);
    }

    // Aquí podrías manejar 401 y usar getAuthToken()/renovar token, etc.

    return Promise.reject(error);
  }
);

export default auth;
