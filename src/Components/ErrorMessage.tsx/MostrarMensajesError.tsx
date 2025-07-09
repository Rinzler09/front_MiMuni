//import {ReactNode } from 'react';

//se declara un alia type que se daclara para que pueda recibir, tambien se puede usar interface si lo prefiere
type ErrorMessageProps = {// 
    children: React.ReactNode // viene un tipo global en donde se puede importar y que no sea global
}

//Componente en donde se va visualizar en la pagina del formulario 
//Tambien se puede reutilizar en distinta parte del proyecto.
export default function ErrorMessage({children}: ErrorMessageProps) {//El children es un prop donde viene de la funcion de ErrorMessageProps
// hace que valide correctamente el mensaje ya que children viene siendo un componente padre donde puede enviar texto
    return (
        //En esta parte tenemos una etiqueta p en donde se mostrata el mensaje que venga 
        //Tambien tenemos una clase de boostrap en donde le estamos diciendo que tenga una alerta en donde aplica el estilo bordes
        //tambien tenemos el alert-danger esto equivale 
        <p className="alert alert-danger text-centeralert alert-danger py-1  small m-1" >{children}</p>
    )
}