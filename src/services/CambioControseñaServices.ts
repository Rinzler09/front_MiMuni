import auth from "../Auth/auth";

// URL de la API
const API_URL = "/login/changePassword";

// Función para cambiar contraseña
// export const cambiarContra = async (n_psswd: string, token:string) => {
export const cambiarContra = async (n_psswd: string) => {
  try {
    // Obtén el correo electrónico y la contraseña vieja desde localStorage
    const email = sessionStorage.getItem("email");//se guarda en login form 
    //const o_psswd = sessionStorage.getItem("password");//se guarda en login form 
    const token = sessionStorage.getItem("access_TKN_OT");//Se usa esta logica debido a que no se puede instancear el hook useAuth()
    console.log("este es el token en cambiocontraseñaservices ", token);
    if (!email) {
      throw new Error("No se encontra correo.");
    }

    // Construimos el payload a enviar
    const payload = {
      email: email.replace(/"/g, ""), // elimina comillas en caso de que existan
      n_psswd, // Nueva contraseña
      // o_psswd, // Contraseña temporal que en este caso es la que se mando al correo
    };

    // Realiza la petición al backend con los headers que incluyan el token nuevo
    //Posiblemente error.
    const response = await auth.post(
      API_URL, payload,
      {
        headers: {
          //Encabezado para poder validar token 
          Authorization: `Bearer ${(token)}`,
        },
      });

    return response.data; // Devuelve la respuesta del backend
  } catch (error: any) {
    console.log(error);
    throw new Error(error.response?.data?.message || "Error al actualizar contraseña. Estamos trabajando para solucionar este inconveniente.");
  }
};
