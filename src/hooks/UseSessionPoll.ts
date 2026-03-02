//useSessionPoll es el hook que se utiliza para poder estar realizando peticiones a GR 
// para validar el estado de la sesion actual

import { useEffect, useRef } from "react";
import { verifySS_Status } from "../services/EstadoSesion";

type Options = {
    intervalMs?: number;
    onInvalid: () => void;
    getToken: () => string | null;
};

export function useSessionPoll({ intervalMs, onInvalid, getToken }: Options) {
    const runningRef = useRef(false);
    //const tokenFueraCk = getToken();
    const tokenRef = useRef(getToken);//para obtener la referencia en tiempo real de la funcion que se esta pasando
    useEffect(() => { tokenRef.current = getToken; }, [getToken]);//este useEffect es para que el valor de tokenRef cambie cada vez que cambia getToken
    const invalidCalledRef = useRef(false);//evita repetir onInvalid

    //console.log("El valor de token FUERA de checkOnce: ", tokenFueraCk);

    useEffect(() => {
        let mounted = true;
        let timeOutId: number;

        async function checkOnce() {

            if (!mounted || document.hidden) return; //si el componente no esta montado entonces que retorne 
            const token = tokenRef.current();
            console.log("El valor de token dentro de checkOnce: ", token);

            if (!token) {
                if (!invalidCalledRef.current) {
                    console.log("No llego el token y se cambio el valor de invalidCalledRef");
                    invalidCalledRef.current = true;
                    //onInvalid(); // si no llega el token entonces que se ejecute onValid;
                }
                return;
            }

            // console.log("El valor de running ref: ", runningRef.current);
            //para evitar solapamientos si ya esta corriendo entonces que no vuelva a correr
            if (runningRef.current) return;
            runningRef.current = true;

            try {
                const { data } = await verifySS_Status(token);//aqui se consulta el servicio que verifica si una sesion es valida o invalida
                console.log("La respuesta del estado de la sesion: ", data.message);

                if (data?.message === "Invalida") {
                    if (!invalidCalledRef.current) {
                        invalidCalledRef.current = true;
                        onInvalid();
                        //   runningRef.current = false; //Si es invalida entonces ya no es necesario que checkOnce se este ejecuntando en loop
                    }
                } else {
                    //si vuelve a ser válida en un futuro con un "Permanecer en esta sesion", permitir futuras invalidaciones
                    invalidCalledRef.current = false; //no se esta ejecutando onInvalid
                }

            } catch (error) {
                console.error("Error verificando sesión:", error);

            } finally {
                runningRef.current = false;
            }
        }

        //el problema es que todo lo que se ejecuta dentro de loop esta quedando desfasado
        const loop = async () => {

            await checkOnce();

            const tknSsStorage = sessionStorage.getItem("access_TKN");
            if (!tknSsStorage) return; //si no existe el tokenRef.current entonces que salga del loop y no agende el siguiente timer

            timeOutId = window.setTimeout(loop, intervalMs);

        }; //cada vez que cambie el token se debe volver a crear el loop 

        //console.log("el valor del token en el useEffect de useSessionPoll", token);
        void loop();//solo si existe el token que se este verificando en loop la sesion ya que si no hay token no hay sesion

        //visibilidad: cuando la pestaña vuelva, debe lanzar la comprobacion inmediata
        const onVisibility = () => { if (!document.hidden) void checkOnce(); }; //void ignora el valor que la funcion checkOnce pueda retornar y es comun cuando la funcion es async y no se quiere manejar el resultado ahi mismo
        document.addEventListener('visibilitychange', onVisibility);

        //El return en un useEffect no devuelve un valor normal.
        //Devuelve una función que React ejecuta cuando El componente se desmonta o el useEffect se vuelve a ejecutar por cambio de dependencias
        return () => { //este return es una funcion de limpieza y normalmente esta dentro de un useEffect en React
            mounted = false;
            document.removeEventListener('visibilitychange', onVisibility);
            clearTimeout(timeOutId);
            runningRef.current = false; //significa que la funcion checkOnce que se ejecuta en loop ya NO se esta ejecutando
        };
    }, [intervalMs, onInvalid, getToken]);
}

