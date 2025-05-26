// src/services/loginFormServices.ts
import { toast } from "sonner";
import auth from "../Auth/auth";
import { mensajes } from "../util/message";
import type { AxiosResponseHeaders } from "axios";
import { MdCheckCircle } from 'react-icons/md';
import React from "react";

const API_URL = "/login/usuario";

interface LoginResponse {
  message: string;
  user: any;
  municipalidades?: string[];
}

interface LoginResult {
  success: boolean;
  message: string;
  isTemporaryPassword?: boolean;
  correo?: any;
  access_token?: string;
  municipalidades?: string[];
}

const interpretarMensaje = (
  mensajeBackend: string
): { mensaje: string; tipo: "success" | "error" | "info" | "post" } => {
  const clave = mensajeBackend.toLowerCase();
  for (const key in mensajes) {
    if (clave.includes(key)) {
      return mensajes[key];
    }
  }
  return { mensaje: mensajeBackend, tipo: "success" };
};

export const login = async (
  email: string,
  password: string
): Promise<LoginResult> => {
  try {
    const response = await auth.post<LoginResponse>(
      API_URL,
      { email, password },
      { validateStatus: (s) => s >= 200 && s < 500 }
    );

    // Encabezado
    const headers = response.headers as AxiosResponseHeaders;

    const viaGet = headers.get("authorization") ?? headers.get("Authorization");

    const rawIndex = (response.headers as Record<string, unknown>)["authorization"]
      ?? (response.headers as Record<string, unknown>)["Authorization"];

    // Normaliza a string | null
    const rawHeader: string | null =
      typeof viaGet === "string" ? viaGet :
      typeof rawIndex === "string" ? rawIndex :
      null;

    //Extrae sólo el token, quitando "Bearer "
    const accessToken: string | undefined =
      rawHeader?.startsWith("Bearer ")
        ? rawHeader.slice(7)
        : rawHeader ?? undefined;

    // DEBUG: Verifica en consola
    console.log("JWT extraído:", accessToken);

    // Si 401, credenciales inválidas
    if (response.status === 401) {
      toast.error(mensajes["credenciales incorrectas"].mensaje);
      return {
        success: false,
        message: mensajes["credenciales incorrectas"].mensaje,
      };
    }

    // Desestructura body
    const { message, user, municipalidades } = response.data;
    const { mensaje, tipo } = interpretarMensaje(message);

    if (tipo === "error") {
      toast.error(mensaje);
      return { success: false, message };
    }

    if (tipo === "info") { // En caso de que sea exitoso 
      toast.info(mensaje);
      return {
        success: true, isTemporaryPassword: true, correo: user, message, access_token: accessToken,};
    }

    // Éxito normal
    toast.success( mensajes['Tus credenciales son correctas.']?.mensaje || 'Tus credenciales son correctas.',{ description: '¡Bienvenido de nuevo!',
      icon: React.createElement(MdCheckCircle, {style: {color: "green", fontSize: "1.2em"}})
    })
    return {
      success: true, isTemporaryPassword: false, correo: user, message, municipalidades, access_token: accessToken,
    };
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Credenciales Incorrectas";
    return { success: false, message: errorMessage };
  }
};
