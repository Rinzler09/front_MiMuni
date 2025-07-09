//Codigo funcional para las pantallas de cambio de contraseña y reseteo de contraseña antes 
// de haberlo integrado para la pagina de general en donde accedera post-login

// src/hooks/useSessionTimeout.tsx
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../Components/ModalComponents/modalComponent";
import { jwtDecode } from "jwt-decode";
import { getAuthToken } from "../Auth/auth";


// const decoded = jwtDecode(token);

interface UseSessionTimeoutOptions {
    onExpire?: () => void; //funcion opcional para expirar sesion
    onRefresh?: () => void; //funcion opcional para renovar token
}

interface JwtPayload {
    exp: number; // Timestamp de expiración en segundos UNIX
}

export function useSessionTimeout({ onExpire, }: UseSessionTimeoutOptions = {}) { /*= {} significa que si no se le pasa nada por defecto sera un objeto vacio*/
    // export function useSessionTimeout({ onExpire, onRefresh, }: UseSessionTimeoutOptions = {}) { /*= {} significa que si no se le pasa nada por defecto sera un objeto vacio*/
    // export function useSessionTimeout() { /*= {} significa que si no se le pasa nada por defecto sera un objeto vacio*/

    const navigate = useNavigate(); //hook que sirve para redirigir las paginas
    const [token, setToken] = useState<string | null>(() => getAuthToken());
    // console.log("Este es el valor del token en use session timeout: ", token);
    // const [token, setToken] = useState<string | null>(() => getAuthToken());//el estado inicial es de token se obtendra de la funcion getAuthToken()
    const [showWarning, setShowWarning] = useState(false);    // Muestra modal de advertencia
    const [countdown, setCountdown] = useState(0);            // Segundos restantes

    //   Refs permiten:
    //   Guardar el timer sin que se reinicie al renderizar el componente.
    //   Poder cancelar el timer luego con clearTimeout(warningTimer.current).
    //   useRef sirve aquí como una “caja mutable” que conserva el ID del timeout 
    //   sin provocar re-renderizados.

    // Refs para almacenar IDs de timers y poder limpiarlos
    const warningTimer = useRef<ReturnType<typeof setTimeout> | null>(null); //este es el hook con el temporizador para mostrar la ventana de warning
    // const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const expireTimer = useRef<ReturnType<typeof setTimeout> | null>(null); //este es el hook con el temporizador para salir de la sesion al login form
    const countdownInterval = useRef<ReturnType<typeof setInterval> | null>(null); //este es el hook con el temporizador dentro del warningTimer que actura como contador



    const clearAll = () => {// se declara una funcion que se utilizara para cancelar todos los temporizadores activos
        [warningTimer, /*refreshTimer,*/ expireTimer].forEach(ref => {//forEach crea un arreglo con las tres refs de los setTimeout y recorre cada una
            if (ref.current) clearTimeout(ref.current);         // si la ref tiene un timeout activo, lo cancela con clearTimeOut
            ref.current = null;                                  // Luego le pone null a la referencia especifica para simbolizar que no hay ningun temporizador
        });
        if (countdownInterval.current) {                       // Comprueba si hay un setInterval activo (para el contador de segundos de la advertencia).
            clearInterval(countdownInterval.current);           // Si existe uno activo entonces lo limpia
            countdownInterval.current = null;                    // Y de igual forma pone la referencia en null
        }
    };


    //   Aqui se programa warningTimer, refresh y expire basandose en expTimeStamp (segundos)
    const scheduleFromExp = useCallback((expTKN_s: number) => {
        console.log("Entro a scheduleFromExp");
        clearAll(); //llama a la funcion para limpiar los timers
        const timeNow_ms = Date.now(); //obtiene la hora actual en ms
        //console.log("el tiempo ahora: ", now); // devuelve algo asi el tiempo ahora:  1750265541964 ms la fecha de hoy en ms
        //console.log("expTimestamp es: ", expTimestamp); // devuelve algo asi 1750267664 la fecha de exp en s
        const expTKN_ms = expTKN_s * 1000; //convierte la expiracion a ms
        const timeToExp_ms = expTKN_ms - timeNow_ms; // A los 10 min en ms que expira el token se le restan los segundos actuales que siempre seran menores ya que el token exp en segundos del futuro
        //console.log("Tiempo restante para que expire el token en ms: ", timeToExp_ms);//muestra 10 min en ms

        if (timeToExp_ms <= 0) { //si el token ya expiro
            handleExpire(); //con esta funcion se fuerza la expiracion
            return;
        }

        // 1) Warning a 2min (120000 ms) antes de que el token expire
        const warningOffset_ms = timeToExp_ms - 120_000; //Calcula cuántos milisegundos faltan para mostrar el warning, 2min antes de la expiración del token se mostrara.
        console.log("este es lo que falta para mostra ventana de estas ahi?", warningOffset_ms);//serian 8 minutos
        if (warningOffset_ms > 0) { // si todavia falta tiempo para que expire el token, programa un warning
            warningTimer.current = setTimeout(() => { //Guarda en la ref en un setTimeout para ejecutar lo siguiente justo al llegar a ese offset, es decir cuando falten 2 minutos.
                setShowWarning(true); //Muestra la modal de advertencia ("¿Sigues ahí?").
                console.log("Ahora Deberia mostrar modal de estas ahi?");

                countdownInterval.current = setInterval(() => {//Inicia un temporizador que se ejecuta cada segundo para la modal de sigues ahi?.
                    const secs = Math.max(Math.ceil((expTKN_ms - Date.now()) / 1000), 0); // Calcula los segundos que faltan hasta la expiración.
                    setCountdown(secs);//Actualiza el contador en pantalla con los segundos restantes.
                    //console.log("este es el countdown", countdown);
                }, 1_000);//Repite ese conteo cada segundo (1000 ms o cada 1s). DEBO PROBAR ESTA PARTE
            }, warningOffset_ms); //Lo interior del setTimeout anterior se ejecutará exactamente warningOffset milisegundos después de ahora.
        } else {
            //este bloque de codigo se debe ejecutar al recargar la pagina 
            // Si ya estamos más allá del punto de warningOffset entonces muestra la ventana modal con el warning
            setShowWarning(true); //Muestra el modal de inmediato.
            const secs = Math.max(Math.ceil((expTKN_ms - Date.now()) / 1000), 0); //Calcula los segundos restantes hasta la expiración total del token.
            setCountdown(secs);//el hook setState obtiene los segundos para la expiracion total
            countdownInterval.current = setInterval(() => {
                const s = Math.max(Math.ceil((expTKN_ms - Date.now()) / 1000), 0);//se debe hacer asi ya que la resta debe ser cada segundo
                setCountdown(s);
            }, 1_000); //Repite ese conteo cada segundo (1000 ms o cada 1s). Este es el contador que va en modal
        }

        expireTimer.current = setTimeout(handleExpire, (expTKN_ms - Date.now())); //se ejecutara handleExpire cuando se cumpla el tiempo de vencimiento del token

    }, []);

    // Manejador de expiración: limpia, cierra warning y llama callback
    //esto ocurre ya cuando se regresa al login form
    const handleExpire = useCallback(() => {
        sessionStorage.removeItem("access_TKN");//este existe en cambio de contraseña inicial y reseteo de contraseña
        sessionStorage.removeItem("email");//este existe en cambio de contraseña inicial
        sessionStorage.removeItem("password");//este existe en cambio de contraseña inicial
        sessionStorage.removeItem("userPayload");//este existe en cambio de contraseña inicial
        clearAll();// Limpia todos los timers
        setShowWarning(false);// Oculta warning
        if (onExpire) onExpire();                            // Llama callback de expire que hace lo que se programa desde cualquier otra parte de la app
        setToken(null);
        //navigate("/"); //cada pantalla debe tener su validacion del navigate                     
        //}, [navigate, onExpire]);
    }, [navigate]);

    // Cada vez que el token cambie, reprograma todo según su exp
    useEffect(() => {
        if (!token) {
            clearAll();                                        // Sin token, limpia timers
            return;
        }
        try {
            const { exp } = jwtDecode<JwtPayload>(token);      // Decodifica exp del JWT
            console.log("Este es el tiempo de exp del token: ", exp)
            scheduleFromExp(exp);                              // Agenda timers
        } catch {
            console.log("hubo un error al obtener el atributo exp");
            handleExpire();                                    // Token inválido => expira
        }
    }, [token, scheduleFromExp, handleExpire]);

    const Modals = (
        <Modal isVisible={showWarning} title="¿Sigues ahí?" showCloseButton={false}>
            <div style={{ textAlign: "center", marginTop: "1rem" }}>
                <p>Por seguridad, tu sesión expirará en:</p>
                <p>
                    <strong>{countdown}</strong> segundo{countdown !== 1 ? "s" : ""}
                </p>
                <button
                    className="modal-button"
                    onClick={() => {
                        setShowWarning(false);                        // Cierra warning
                        // if (onRefresh) onRefresh();                   // Refresh manual inmediato
                    }}
                >
                    Continuar trabajando
                </button>
            </div>
        </Modal>
    );

    return { Modals };  // Devuelve el componente con las Modales 
}
