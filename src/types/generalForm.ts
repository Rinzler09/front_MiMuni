export type registroSolicitud = {
    nombrecompleto: string
    identidad: string
    rtn: string   
    correo: string
    telefono: string
}

export type RegisterForm = Pick<registroSolicitud, 'nombrecompleto' | 'identidad' | 'correo' | 'telefono'> & {}

// cambio de contraseñas
export type cambioContraseña ={
   
    contraseña: string
    confirmaContra: string
}
export type cambioContra = Pick<cambioContraseña, 'contraseña' | 'confirmaContra'> & {}

// Verificacion de login
export type confirmacionLogin = {
    email: string
    contra: string
}
export type loginConfir = Pick<confirmacionLogin, 'email' | 'contra'> &{}

//Confirmacion de correo electronico
export type verificacion = {
    email:string
}
export type verif = Pick<verificacion, 'email'> &{}

//Confirmacion de codigo 
export type codigoVerificacion = {
    otp:string
}
export type codigoVerif = Pick<codigoVerificacion, 'otp'> &{}