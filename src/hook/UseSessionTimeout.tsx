//El hook useSessionTimeout tal cual está definido cubre correctamente las tres tareas clave:

// 1) Inicializar y programar los timers basados en el exp del JWT cuando llegue un token nuevo (en el useEffect de [token, initializeSession, handleExpire]).
// 2) Limpiar y reprogrmar esos mismos timers cuando se detecta actividad del usuario (en resetSession, que ahora incluye clearAll() antes de volver a llamar a initializeSession).
// 3) Gestionar la expiración definitiva con handleExpire, que borra el storage, oculta el warning, llama a el callback onExpire y limpia el estado.

import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../Components/ModalComponents/modalComponent";
import { jwtDecode } from "jwt-decode";
import { getAuthToken } from "../Auth/auth";
import { useAuth } from "../Auth/AuthContext";


// const decoded = jwtDecode(token);

interface UseSessionTimeoutOptions {
    onExpire?: () => void; //funcion opcional para expirar sesion
    onRefresh?: () => void; //funcion opcional para renovar token
    isOTimeSession?: boolean; //asi sabremos si es una sesion para solo una vez (usadas en pantallas de contraseñas) o una sesion normal
}

interface JwtPayload { //interfaz que se usara para decodificar el exp del token
    exp: number; // Timestamp de expiración en segundos UNIX
}

export function useSessionTimeout({ onExpire, onRefresh, isOTimeSession, }: UseSessionTimeoutOptions = {}) { /*= {} significa que si no se le pasa nada por defecto sera un objeto vacio*/
    // export function useSessionTimeout({ onExpire, onRefresh, }: UseSessionTimeoutOptions = {}) { /*= {} significa que si no se le pasa nada por defecto sera un objeto vacio*/
    // export function useSessionTimeout() { /*= {} significa que si no se le pasa nada por defecto sera un objeto vacio*/

    const navigate = useNavigate(); //hook que sirve para redirigir las paginas
    // const [token, setToken] = useState<string | null>(() => getAuthToken());
    // console.log("Este es el valor del token en use session timeout: ", token);
    // const [token, setToken] = useState<string | null>(() => getAuthToken());//el estado inicial es de token se obtendra de la funcion getAuthToken()
    const [showWarning, setShowWarning] = useState(false);    // Muestra modal de advertencia
    const [countdown, setCountdown] = useState(0);            // Segundos restantes
    const [isOTSession, setIsOTSession] = useState(false); // hook para manejar mensaje de ventana modal
    const [canRenewTKN, setCanRenewTKN] = useState(true); // hook para la logica de renovacion del TKN 
    const { refreshToken, setToken, token } = useAuth();

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

    const handleExpire = useCallback(() => {
        console.log("Entro a Handle Expire");
        sessionStorage.removeItem("access_TKN");//este existe en cambio de contraseña inicial y reseteo de contraseña
        sessionStorage.removeItem("email");//este existe en cambio de contraseña inicial
        sessionStorage.removeItem("password");//este existe en cambio de contraseña inicial
        sessionStorage.removeItem("userPayload");//este existe en cambio de contraseña inicial
        sessionStorage.removeItem("selectedMunicipality");//este existe en general y se le agrega valor cuando selecciona una Muni
        clearAll();// Limpia todos los timers
        setShowWarning(false);// Oculta warning
        setIsOTSession(false);//hook para mostrar que es sesion de uso Unico para el boton de la modal
        setCanRenewTKN(false); // una vez cerrada la sesion no se puede renovar el token 
        if (onExpire) onExpire();                            // Llama callback de expire que hace lo que se programa desde cualquier otra parte de la app
        setToken(null);
        //navigate("/"); //cada pantalla debe tener su validacion del navigate                     
        //}, [navigate, onExpire]);
    }, [navigate]);


    //   Aqui se programa warningTimer, refresh y expire basandose en expTimeStamp (segundos)
    const initializeOTSession = useCallback((expTKN_s: number) => {
        console.log("Entro a initializeOTSession");
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
        const warningOffset_ms = timeToExp_ms - 60_000; //Calcula cuántos milisegundos faltan para mostrar el warning, 2min antes de la expiración del token se mostrara.
        console.log("este es lo que falta para mostra ventana de estas ahi?", warningOffset_ms);//serian 8 minutos
        if (warningOffset_ms > 0) { // si todavia falta tiempo para que expire el token, programa un warning
            warningTimer.current = setTimeout(() => { //Guarda en la ref en un setTimeout para ejecutar lo siguiente justo al llegar a ese offset, es decir cuando falten 2 minutos.
                setShowWarning(true); //Muestra la modal de advertencia ("¿Sigues ahí?").
                setIsOTSession(true);
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
            setIsOTSession(true);
            const secs = Math.max(Math.ceil((expTKN_ms - Date.now()) / 1000), 0); //Calcula los segundos restantes hasta la expiración total del token.
            setCountdown(secs);//el hook setState obtiene los segundos para la expiracion total la cual saca al user de la pantalla 
            countdownInterval.current = setInterval(() => {
                const s = Math.max(Math.ceil((expTKN_ms - Date.now()) / 1000), 0);//se debe hacer asi ya que la resta debe ser cada segundo
                setCountdown(s); //este setCountdown solo es para lo visual es decir los segundos que se muestran en la modal, si se quitan siempre se sacara al usuario de dicha pantalla ya que solo es visual
            }, 1_000); //Repite ese conteo cada segundo (1000 ms o cada 1s). Este es el contador que va en modal
        }

        expireTimer.current = setTimeout(handleExpire, (expTKN_ms - Date.now())); //se ejecutara handleExpire cuando se cumpla el tiempo de vencimiento del token

    }, [onExpire]);
    //Solo se vuelve a recrear la funcion de initializeOTSession si cambia onExpire u onRefresh
    //Garantiza que, cuando efectivamente cambie el callback que se le da al expirar o al refrescar sesion la logica se actualice de nuevo



    //me quede por aqui ya que debo validar la logica del hook canrenewTKN para ver cuando puede renovar el accessToken
    //  y tengo que ver si el use Effect va aqui o en General.tsx.  

    // const initializeRFSession = useCallback((expTKN_s: number) => {
    const initializeRFSession = useCallback(() => {
        // console.log("Entro a InitializeRFSession");
        setCanRenewTKN(true);
        // console.log("El valor de canRenew, ", canRenewTKN);
        clearAll(); // limpia temporizadores anteriores usados para las ventanas modales
        const delay = 240_000;                  // 4 minutos para mostrar la venta modal tras inactividad
        const deadline = Date.now() + delay; // toma los milisegundos de la fecha actual y le suma los milisegundos de delay

        // Tras 4 min de inactividad el warning y empieza conteo
        warningTimer.current = setTimeout(() => {
            setShowWarning(true);

            countdownInterval.current = setInterval(() => {
                const remainingMs = deadline - Date.now();
                const secs = Math.max(Math.ceil(remainingMs / 1000), 0);
                setCountdown(secs);
            }, 1000);
        }, delay - 60_000);

        // Y a la misma vez se agenda el logout
        expireTimer.current = setTimeout(handleExpire, delay);//aqui se esta usando la funcion handleexpire la cual se ejecutara 4 min despues de inactividad

        // console.log("El valor de warniungtimer", warningTimer);
        // console.log("El valor de expireTimer", expireTimer);
    }, [handleExpire]);//se usa como dependencia ya que se esta usando dentro del callback 


    // Manejador de expiración: limpia, cierra warning y llama callback
    //esto ocurre ya cuando se regresa al login form

    // useEffect(() => {
    //     console.log("Entro al useEffect para refrescar el token ")
    //     const intervalId = setInterval(() => { //se usa un setInterval ya que es un bloque de codigo que queremos que se este ejecutando periodicamente

    //         // Solo refresca el token si no esta mostrando el warning y el hook canRenewTKN es true
    //         if (canRenewTKN) {
    //             console.log("Intentando refrescar token");
    //             refreshToken();
    //         } else {
    //             console.log("No se pudo refrescar el token");
    //         }
    //     }, 240_000); //este intervalo se ejecutara cada 3:30 min lo cual dejara al token de salida obsoleto en 1:30 min

    //     return () => clearInterval(intervalId);// Limpieza al desmontar o cuando cambien dependencias
    // }, [refreshToken]);



    //iba despues de los console.logs
    // if (remainingExpMs < 60_000 && canRenewTKN) { //si los segundos restantes para la expiracion del token son 60s
    //     console.log("Intentando refrescar token sin Timeout (por recarga)");
    //     refreshToken();
    // }
    // else {
    //     console.log("No se pudo refrescar el token");
    // }


    // Cada vez que el token cambie, reprograma todo según su exp
    useEffect(() => { // este useEffect arranca el ciclo basándose en la llegada de un token nuevo.
        if (!token) {
            clearAll();                                        // Sin token, limpia timers
            return;
        }
        try {
            const { exp } = jwtDecode<JwtPayload>(token);      // Decodifica exp del JWT
            // console.log("Este es el tiempo de exp del token: ", exp)
            if (isOTimeSession) { // Cuando se instancia la funcion de useSessionTimeOut y se le envia true a la opcion isOTimeSession
                //  desde cualquier parte del aplicativo entonces inicializa una sesion unica, de lo contrario inicializa una sesion normal
                initializeOTSession(exp);// Agenda los timers segun el tiempo de expiracion
                // setIsOTSession(true);
            } else {
                initializeRFSession();
            }


        } catch (error) {
            console.log("hubo un error al obtener el atributo exp: ", error);
            handleExpire();                                    // Token inválido => expira
        }
        // }, [token, initializeSession, handleExpire]);
    }, [handleExpire]);
    //dependencias de initializeOTSession:
    //  token = Si el JWT cambia  se debe reprogramar todo el ciclo de expiracion basandose en la nueva expiracion, 
    // initializeSession = esta es la funcion que agenda los setTimeout para warning y logout y si cambia onRefresh u onExpire se debe usar su nueva version
    // handleExpire = se usa al expirar session entonces si su referencia cambia el efecto debe re-registrarse


    useEffect(() => {// UseEffect para refrescar el token un minuto antes de que este expire
        if (!isOTimeSession) {//si no es una OneTimeSession entonces que se intente
            console.log("Entro al useEffect para refrescar el token.\nEs una OTSession: ", isOTimeSession);

            if (!token) {
                console.log("No existe un token");
                return;
            }

            console.log("Este es el token que se decodifica: ", token);
            const { exp } = jwtDecode<JwtPayload>(token);
            const expMs = exp * 1000; //obtengo la expiracion del token en Ms
            const timeNowMs = Date.now(); //Obtengo el tiempo actual en Ms
            const remainingExpMs = expMs - timeNowMs; // al tiempo de expiracion le resto el tiempo de ahora y eso me da los Ms
            console.log("Esto es lo que falta para que expire el token en Ms: ", remainingExpMs);

            const timeOut = setTimeout(() => {
                console.log("Intentando refrescar token con TimeOut");
                if (canRenewTKN) refreshToken();
            }, remainingExpMs - 60_000)//quiero que se refresque 1 min antes de la exp del token 

            // console.log("Este es el timeOut ID: ", timeOut);
            console.log("Esto falta para que el timeout se ejecute: ", remainingExpMs - 60_000);

            return () => clearTimeout(timeOut);
        }
    }, [token])
    // }, [refreshToken])

    const Modals = (
        <Modal isVisible={showWarning} title={isOTSession ? 'Advertencia' : '¿Sigues ahí?'} showCloseButton={false}>
            <div style={{ textAlign: "center", marginTop: "1rem" }}>
                <p>Por tu seguridad, la sesión expirará en:</p>
                <p>
                    <strong>{countdown}</strong> segundo{countdown !== 1 ? "s" : ""}
                </p>
                <button
                    className="modal-button"
                    onClick={() => {
                        setShowWarning(false); // Cierra warning
                        if (!isOTSession) { // si no es una sesion de uso unico entonces que pueda ejecutar bloque que refresca el token
                            console.log("evento onClick y es un RFSession");
                            initializeRFSession(); //Inicializa la sesion de nuevo en caso de que el usuario este ahi
                        }
                    }}
                >
                    {isOTSession ? 'Entendido' : 'Continuar trabajando'}
                </button>
            </div>
        </Modal>
    );

    return { Modals, initializeRFSession, handleExpire };  // Devuelve el componente con las Modales 
    //handleExpire: se devuelve porque se utiliza en pantallas (ej. CambioContrasena) para limpiar los sessionStorage y otro contenido que pueda quedar de la sesion
}
