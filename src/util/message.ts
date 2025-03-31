// src/utils/mensajes.ts
export const mensajes: { [key: string]: { mensaje: string; tipo: "success" | "error" | "info" | "post"} } = {
    "credenciales incorrectas": {
      mensaje: "Credenciales Incorrectas, verifica tus credenciales y vuelve a intentarlo.",
      tipo: "error",
    },
    "contraseña temporal": {
      mensaje: "Tu contraseña temporal es correcta. Se recomienda cambiarla para mayor seguridad.",
      tipo: "info",
    },
    "too many requests": {
        mensaje: "Has hecho muchos intentos. prueba mas tarde.",
        tipo: "error",
      },
    "Contraseña correcta": {
        mensaje: "Tus credenciales son correctas.",
        tipo: "success",
    },
  };
  