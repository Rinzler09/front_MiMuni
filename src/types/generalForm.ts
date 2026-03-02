export type registroSolicitud = {
    // nombrecompleto: string
    identidad: string
    rtn: string
    correo: string
    telefono: string
}

// export type RegisterForm = Pick<registroSolicitud, 'nombrecompleto' | 'identidad' | 'correo' | 'telefono'> & {}
export type RegisterForm = Pick<registroSolicitud, 'identidad' | 'correo' | 'telefono'> & {}

// cambio de contraseñas
export type cambioContrasena = {
    contrasena: string
    confirmaContra: string
}
export type cambioContra = Pick<cambioContrasena, 'contrasena' | 'confirmaContra'> & {}

//Cambio de contraseña para sesion
export type resetPwdSession = {
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

export type tarjetaPago = {
    number: string;
    nombreTarjeta: string;
    expiry: string;
    cvv: string;
    direccion?: string;
}

export type cardForm = Pick<tarjetaPago, 'number' | 'nombreTarjeta' | 'expiry' | 'cvv'> & {}