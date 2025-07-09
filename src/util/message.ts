// src/utils/mensajes.ts
// export const mensajes: { [key: string]: { mensaje: string; tipo: "success" | "error" | "info" | "post"} } = {
export const mensajes: { [key: string]: { mensaje: string; tipo: string } } = {

  "credenciales incorrectas": { mensaje: "Credenciales Incorrectas, verifica tus credenciales y vuelve a intentarlo.", tipo: "error", },

  "contraseña temporal": { mensaje: "Tu contraseña temporal es correcta. Se recomienda cambiarla para mayor seguridad.", tipo: "infoPwdTemporal", },

  "too many requests": { mensaje: "Has realizado muchos intentos. Espera un momento.", tipo: "error", },

  "Contraseña correcta": { mensaje: "Tus credenciales son correctas.", tipo: "success", },

  "Error al obtener facturas para este bien inmueble": { mensaje: "No se han encontrado facturas para este bien inmueble.", tipo: "error", },

  //"Correo no encontrado":{mensaje: "El correo electronico no se encuentra registrado.",tipo: "info",},

  "Codigo no incorrecto": { mensaje: "El codigo no es correcto, ingrese el codigo correcto", tipo: "error", },

  "Codigo invalido": { mensaje: "El codigo que agregaste es invalida, vuelva genera un nuevo codigo", tipo: "error" },

  "Contraseña actualizada correctamente": { mensaje: "La contraseña se actualizo correctamente", tipo: "success" },

  "Seleccion municipalidad": { mensaje: "Por favor, seleccione la municipalidad correspondiente para proceder con el proceso de pago.", tipo: "info" }


};
