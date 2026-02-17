export type registroSolicitud = {
    dni: string
    rtn: string
    email: string
    telefono: string
}

export type RegisterForm = Pick<registroSolicitud, 'dni' | 'email' | 'telefono'> & {}

// cambio de contraseñas
export type cambioContrasena = {
    contrasena: string
    confirmaContra: string
}
export type cambioContra = Pick<cambioContrasena, 'contrasena' | 'confirmaContra'> & {}

//Cambio de contraseña para sesion
export type resetPwdSession ={
    contrasenaAnterior: string 
    contrasena: string
    confirmaContra: string
}


// Verificacion de login
export type confirmacionLogin = {
    email: string
    contra: string
}
export type loginConfir = Pick<confirmacionLogin, 'email' | 'contra'> & {}

//Confirmacion de correo electronico
export type verificacion = {
    email: string
}
export type verif = Pick<verificacion, 'email'> & {}

//Confirmacion de codigo 
export type codigoVerificacion = {
    otp: string
}
export type codigoVerif = Pick<codigoVerificacion, 'otp'> & {}

//Formulario de tarjeta de pago
export type tarjetaPago = {
    number: string;
    nombreTarjeta: string;
    expiry: string ; 
    cvv: string;
    direccion?: string;
}
export type cardForm = Pick<tarjetaPago, 'number' | 'nombreTarjeta' | 'expiry' | 'cvv'> & {}

//Exportacion de los tipos para el carrusel
export type carruselProps ={
    id: number;
    title: string;
    description: string;
    imageUrls: string[];
}

//mejoracion del contenido que viene desde el sidebar
export const getMunicipialkey = (municipio?: string): string =>{
    if (!municipio) return "";

    const value = municipio.toLowerCase();

    //Aqui es donde iran todasa las las municipalidades que se vayan agregando 
    if (value.includes("santa")) return "SantaLucia";
    if (value.includes("valleAngeles")) return "ValleAngeles";
    if (value.includes("choluteca")) return "Choluteca";
    
    return "";

};