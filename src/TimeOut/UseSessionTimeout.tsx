//El hook useSessionTimeout tal cual está definido cubre correctamente las tres tareas clave:

// 1) Inicializar y programar los timers basados en el exp del JWT cuando llegue un token nuevo (en el useEffect de [token, initializeSession, handleExpire]).
// 2) Limpiar y reprogrmar esos mismos timers cuando se detecta actividad del usuario (en resetSession, que ahora incluye clearAll() antes de volver a llamar a initializeSession).
// 3) Gestionar la expiración definitiva con handleExpire, que borra el storage, oculta el warning, llama a el callback onExpire y limpia el estado.

import { useState, useEffect, useRef, useCallback } from "react";
import Modal from "../Components/ModalComponents/modalComponent";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../Auth/AuthContext";
import { logoutUsuario } from "../services/EliminacionCookie";


// const decoded = jwtDecode(token);

interface UseSessionTimeoutOptions {
    onExpire?: () => void; //funcion opcional para expirar sesion
    // onRefresh?: () => void; //funcion opcional para renovar token
    isOTimeSession?: boolean; //asi sabremos si es una sesion para solo una vez (usadas en pantallas de contraseñas) o una sesion normal
}

interface JwtPayload { //interfaz que se usara para decodificar el exp del token
    exp: number; // Timestamp de expiración en segundos UNIX
}

export function useSessionTimeout({ onExpire, isOTimeSession, }: UseSessionTimeoutOptions = {}) { /*= {} significa que si no se le pasa nada por defecto sera un objeto vacio*/

    const [showWarning, setShowWarning] = useState(false);    // Muestra modal de advertencia
    const [countdown, setCountdown] = useState(0);            // Segundos restantes
    const [isOTSession, setIsOTSession] = useState(false); // hook para manejar mensaje de ventana modal
    const [canRenewTKN, setCanRenewTKN] = useState(true); // hook para la logica de renovacion del TKN 
    const { refreshToken, tokenOT, token } = useAuth();
    const [hasAcceptedOT, setHasAcceptedOT] = useState(false); //hook para el manejo del estado del boton de "Entendido" en ventana modal de sesiones OT
    const [showExpired, setShowExpired] = useState(false); // Muestra modal de sesion expirada

    // Refs para almacenar IDs de timers y poder limpiarlos
    const warningTimer = useRef<ReturnType<typeof setTimeout> | null>(null); //este es el hook con el temporizador para mostrar la ventana de warning
    // const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const expireTimer = useRef<ReturnType<typeof setTimeout> | null>(null); //este es el hook con el temporizador para salir de la sesion al login form
    const expireInterval = useRef<ReturnType<typeof setInterval> | null>(null); //este es el hook con el temporizador para salir de la sesion al login form
    const countdownInterval = useRef<ReturnType<typeof setInterval> | null>(null); //este es el hook con el temporizador dentro del warningTimer que actura como contador
    const showWarningRef = useRef(showWarning);
    const countdownRef = useRef(countdown);
    const hasAcceptedOTRef = useRef(hasAcceptedOT);

    useEffect(() => { showWarningRef.current = showWarning; }, [showWarning]); //useEffect para actualizar la variable refShowWarning cada vez que el hook showWarning cambie, asi el handleExpire usara referencia a una ref en vez de un useState estatico
    useEffect(() => { countdownRef.current = countdown; }, [countdown]); //hace lo mismo que el useEffect de showWarning
    useEffect(() => { hasAcceptedOTRef.current = hasAcceptedOT; }, [hasAcceptedOT]);

    const clearAll = useCallback(() => {// se declara una funcion que se utilizara para cancelar todos los temporizadores activos
        [warningTimer, /*refreshTimer,*/ expireTimer].forEach(ref => {//forEach crea un arreglo con las tres refs de los setTimeout y recorre cada una
            if (ref.current) { //si existe un setTimeout con el ID que se itera 
                // console.log("Limpiando Timer con ID (ClearAll): ", ref.current, " y es de tipo(ref): ", typeof ref.current);
                clearTimeout(ref.current);         // si la ref tiene un timeout activo, lo cancela con clearTimeOut
            }
            ref.current = null;                                  // Luego le pone null a la referencia especifica para simbolizar que no hay ningun temporizador
        });
        if (countdownInterval.current) {                       // Comprueba si hay un setInterval activo (para el contador de segundos de la advertencia).
            clearInterval(countdownInterval.current);           // Si existe uno activo entonces lo limpia
            countdownInterval.current = null;                    // Y de igual forma pone la referencia en null
        }

        // if (expireInterval.current) { //se agrego para limpiar el nuevo expireInterval 
        //     clearInterval(expireInterval.current);
        //     expireInterval.current = null;
        // }
    }, []);// se cambio clearAll a una funcion que usa useCallback para memorizar 

    const handleExpire = useCallback(() => {
        console.log("Entro a la funcion de handleExpire()");
        const notGeneralLocations = ['/', '/registrar-usuario', '/enviar-codigo', '/cambio-contrasena', '/restablecer-contrasena'];//Las rutas en donde el expireTimer de General no tendra efecto

        if (!isOTimeSession) { //Si no esta en una pantalla que sea de One Time Session entonces se ejecuta
            //  este bloque y esto es debido a que las One Time Sessions no usan rfToken
            const newToken = sessionStorage.getItem("access_TKN");

            const removeRF_TKN = async () => {//Intenta remover el refreshToken
                if (newToken) {
                    try {
                        await logoutUsuario(newToken as string);
                    } catch (err) {
                        console.log("Error al hacer logout para remover el RF_Token:", err);
                    }
                } else {
                    console.log("No hay Refresh Token que remover")
                }
            }
            removeRF_TKN();

            if (!notGeneralLocations.includes(window.location.pathname)) {
                console.log("Location: ", window.location.pathname);
                sessionStorage.removeItem("access_TKN");//este existe en cambio de contraseña inicial y reseteo de contraseña
                sessionStorage.removeItem("userPayload");//este existe en cambio de contraseña inicial
                sessionStorage.removeItem("selectedMunicipality");//este existe en general y se le agrega valor cuando selecciona una Muni
                setShowWarning(false);// Oculta warning
                setIsOTSession(false);//hook para mostrar que es sesion de uso Unico para el boton de la modal
                setCanRenewTKN(false); // una vez cerrada la sesion no se puede renovar el token    
                // if (onExpire) onExpire(); se comento para que fuera agregado a la Modal de sesion expirada 
                console.log("Navegara a '/' ya que esta en una ruta que se carga en General.tsx");
                clearAll();// Limpia todos los timers
                setShowExpired(true);//se agrego esta linea ya que es el hook que mostrara la ventana modal de sesion expirada

                return;
            } else {
                console.log("NO navego a '/' ya que esta en una ruta que NO se carga en General.tsx");
                return;
            }
        } else {
            //Bloque para oneTimeSessions
            console.log("Se ejecuto onExpire sin la validacion de GeneralLocations debido a que es una isOtimeSession")
            //De igual forma las pantallas que sean una isOtimeSession siempre deben ejecutar el onExpire
            sessionStorage.removeItem("access_TKN_OT");
            sessionStorage.removeItem("email");//este existe en cambio de contraseña inicial
            sessionStorage.removeItem("password");//este existe en cambio de contraseña inicial
            clearAll();// Limpia todos los timers
            setShowWarning(false);// Oculta warning
            setShowExpired(true);//se agrego esta linea ya que es el hook que mostrara la ventana modal de sesion expirada
            // if (onExpire) onExpire();  se comento para que fuera agregado a la Modal de sesion expirada 
            return;
        }

    }, []);

    //   Aqui se programa warningTimer, refresh y expire basandose en expTimeStamp (segundos)
    const initializeOTSession = useCallback((expTKN_s: number) => {
        console.log("Entro a initializeOTSession");
        setIsOTSession(true);
        clearAll(); //llama a la funcion para limpiar los timers
        const timeNow_ms = Date.now(); //obtiene la hora actual en ms
        //console.log("el tiempo ahora: ", now); // devuelve algo asi el tiempo ahora:  1750265541964 ms la fecha de hoy en ms
        //console.log("expTimestamp es: ", expTimestamp); // devuelve algo asi 1750267664 la fecha de exp en s
        const expTKN_ms = expTKN_s * 1000; //convierte la expiracion a ms
        const timeToExp_ms = expTKN_ms - timeNow_ms; // A los 10 min en ms que expira el token se le restan los segundos actuales que siempre seran menores ya que el token exp en segundos del futuro
        //console.log("Tiempo restante para que expire el token en ms: ", timeToExp_ms);//muestra 10 min en ms

        if (timeToExp_ms <= 0) { //si el token ya expiro
            console.log("timeToExp_ms <= 0");
            handleExpire(); //con esta funcion se fuerza la expiracion
            return;
        }

        // 1) Warning a 2min (120000 ms) antes de que el token expire
        const warningOffset_ms = timeToExp_ms - 60_000; //Calcula cuántos milisegundos faltan para mostrar el warning, 2min antes de la expiración del token se mostrara.
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
            setIsOTSession(true);
            const secs = Math.max(Math.ceil((expTKN_ms - Date.now()) / 1000), 0); //Calcula los segundos restantes hasta la expiración total del token.
            setCountdown(secs);//el hook setState obtiene los segundos para la expiracion total la cual saca al user de la pantalla 
            countdownInterval.current = setInterval(() => {
                const s = Math.max(Math.ceil((expTKN_ms - Date.now()) / 1000), 0);//se debe hacer asi ya que la resta debe ser cada segundo
                setCountdown(s); //este setCountdown solo es para lo visual es decir los segundos que se muestran en la modal, si se quitan siempre se sacara al usuario de dicha pantalla ya que solo es visual
            }, 1_000); //Repite ese conteo cada segundo (1000 ms o cada 1s). Este es el contador que va en modal
        }

        expireTimer.current = setTimeout(
            () => {
                console.log("Entro al expireTimer de initializeOTSession que ejecuta handleExpire()");
                console.log("El valor de showWarningRef en expireTimer: ", showWarningRef,
                    " el de CountDownRef es: ", countdownRef, " y el de hasAcceptedOTRef es: ", hasAcceptedOTRef);
                console.log('visibilityState:', document.visibilityState); // 'visible' | 'hidden' | 'prerender'

                if ((showWarningRef.current === true && countdownRef.current <= 2) ||
                    (hasAcceptedOTRef.current === true && countdownRef.current <= 2)) { //se tiene que usar .current para acceder al valor del useRef ya que si solo se compara countdownRef se estaria comparando todo el objeto al numero 1 lo cual genera un ERROR
                    handleExpire();
                } else {
                    if (document.visibilityState === "visible") {// Si el usuario esta en la pantalla de MML
                        console.log("El documento esta visible")
                        console.log("No esta mostrando la venta modal de alerta de sesionOT, no se va a ejecutar el codigo de handleExpire().");
                        return;
                    } else { // si el documento esta hidden o prerender como en caso de que el user bloquee el OS
                        console.log("El documento NO esta visible")
                        if (showWarningRef.current === true) { //showWarningRef.current === true solo ese atributo es necesario ya que countdownref varia mucho (que siempre el countdown es menor a 30s cuando se congela) cuando el doc esta hidden
                            console.log("Entrara a handleExpire con el documento hidden")
                            handleExpire();
                        }
                    }

                }

            }, (expTKN_ms - Date.now())); //se ejecutara handleExpire cuando se cumpla el tiempo de vencimiento del token

    }, [onExpire]);
    //Solo se vuelve a recrear la funcion de initializeOTSession si cambia onExpire u onRefresh
    //Garantiza que, cuando efectivamente cambie el callback que se le da al expirar o al refrescar sesion la logica se actualice de nuevo


    // const initializeRFSession = useCallback((expTKN_s: number) => {
    const initializeRFSession = useCallback(() => {
        setCanRenewTKN(true);
        clearAll(); // limpia temporizadores anteriores usados para las ventanas modales
        const delay = 240_000; // 4 minutos para ejecutar el expireTimer 
        const deadline = Date.now() + delay; // toma los milisegundos de la fecha actual y le suma los milisegundos de delay

        // Tras 4 min de inactividad el warning y empieza conteo
        warningTimer.current = setTimeout(() => {
            setShowWarning(true);
            console.log("Ahora debe mostrar ventana modal de inactividad");

            countdownInterval.current = setInterval(() => {
                const remainingMs = deadline - Date.now();
                const secs = Math.max(Math.ceil(remainingMs / 1000), 0);
                setCountdown(secs);
            }, 1000);

            //Este bloque se agregara como metodo de prueba
            // expireInterval.current = setInterval(() => {
            //     console.log("Entro al expireInterval de initializeRFSession que ejecuta handleExpire()");
            //     console.log("El valor de showWarningRef en expireInterval: ", showWarningRef, " y el de CountDown es: ", countdownRef);
            //     if (showWarningRef.current === true && countdownRef.current <= 1) { //se tiene que usar .current para acceder al valor del useRef ya que si solo se compara countdownRef se estaria comparando todo el objeto al numero 1 lo cual genera un ERROR
            //         handleExpire();
            //     } else {
            //         console.log("No esta mostrando la venta modal de alerta de sesionRF, no se va a ejecutar el codigo de handleExpire(). ");
            //         return;
            //     }
            // }, 1000);//aqui se esta usando la funcion handleexpire la cual se ejecutara 4 min despues de inactividad
            //Bloque de prueba termina aqui 


        }, delay - 60_000);//se mostrara el warning al minuto 3 de inactividad 

        // console.log("El ultimo warning timer que se agendo fue el ID: ", warningTimer.current)

        // Y a la misma vez se agenda el expireTimer
        expireTimer.current = setTimeout(
            () => {
                console.log("Entro al expireTimer de initializeRFSession que ejecuta handleExpire()");
                console.log("El valor de showWarningRef en expireTimer: ", showWarningRef, " y el de CountDown es: ", countdownRef);
                // Chequear el estado inicial
                console.log('visibilityState:', document.visibilityState); // 'visible' | 'hidden' | 'prerender'
                // // Para saber si el documento tiene foco
                // console.log('hasFocus() en el documento a la hora de ejecutarse el expireTimer:', document.hasFocus()); // true | false
                if (showWarningRef.current === true && countdownRef.current <= 2) { //se tiene que usar .current para acceder al valor del useRef ya que si solo se compara countdownRef se estaria comparando todo el objeto al numero 1 lo cual genera un ERROR
                    handleExpire();
                } else {
                    if (document.visibilityState === "visible") {// Si el usuario esta en la pantalla de MML
                        console.log("El documento esta visible")
                        console.log("No esta mostrando la venta modal de alerta de sesionRF, no se va a ejecutar el codigo de handleExpire(). ");
                        return;
                    } else {// si el documento esta hidden o prerender como en caso de que el user bloquee el OS 
                        console.log("El documento NO esta visible")
                        if (showWarningRef.current === true) { //showWarningRef.current === true solo ese atributo es necesario ya que countdownref varia mucho (que siempre el countdown es menor a 30s cuando se congela) cuando el doc esta hidden
                            console.log("Entrara a handleExpire con el documento hidden")
                            handleExpire();
                        }
                    }
                }

            }, delay);//aqui se esta usando la funcion handleexpire la cual se ejecutara 4 min despues de inactividad

    }, []);//se usa como dependencia ya que se esta usando dentro del callback 


    // Cada vez que el token cambie, reprograma todo según su exp
    useEffect(() => { // este useEffect arranca el ciclo basándose en la llegada de un token nuevo.
        console.log("Entro al UseEffect que arranca todos las sesiones");

        try {
            if (tokenOT) {
                if (isOTimeSession) { // Cuando se instancia la funcion de useSessionTimeOut y se le envia true a la opcion isOTimeSession
                    //  desde cualquier parte del aplicativo entonces inicializa una sesion unica, de lo contrario inicializa una sesion normal
                    const { exp } = jwtDecode<JwtPayload>(tokenOT);      // Decodifica exp del JWT
                    // console.log("Este es el tiempo de exp del token: ", exp)
                    initializeOTSession(exp);// Agenda los timers segun el tiempo de expiracion
                    // setIsOTSession(true);
                }
            } else {
                initializeRFSession();
            }

        } catch (error) {
            console.log("hubo un error al obtener el atributo exp: ", error);
            handleExpire();                                    // Token inválido => expira
        }

    }, []);
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

    //La constante Modals es donde se definen las ventanas modales de advertencia para las sesiones RF y OT  
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
                            console.log("evento onClick y es un RFsession");
                            initializeRFSession(); //Inicializa la sesion de nuevo en caso de que el usuario este ahi
                        } else {
                            console.log("evento onClick y es una OTsession");
                            setHasAcceptedOT(true); //En caso de que le haya aparecido el mensaje de "Entendido" en el boton de la modal si es una OTsession
                        }
                    }}
                >
                    {isOTSession ? 'Entendido' : 'Continuar trabajando'}
                </button>
            </div>
        </Modal>
    );

    //La constante SsExpiredModal es donde se definen las ventanas modales de sesion caducada para las sesiones RF y OT, las cuales navegaran al Login en su evento onClick
    const SsExpiredModal = (
        <Modal isVisible={showExpired} title={isOTSession ? 'Tiempo Agotado' : 'Sesion Expirada'} showCloseButton={false}>
            <div>
                <p>{isOTSession ? "Por favor, inténtalo de nuevo." :
                    "Por favor, vuelve a iniciar sesión."}
                </p>
                <button
                    className="modal-button"
                    onClick={() => {
                        setShowExpired(false); //cierra la ventana modal de expired
                        if (onExpire) onExpire();
                    }}
                >
                    {isOTSession ? 'Regresar' : 'Iniciar sesión'}
                </button>
            </div>

        </Modal>
    );

    return { Modals, initializeRFSession, clearAll, SsExpiredModal };  // Devuelve el componente con las Modales 
    //handleExpire: se devuelve porque se utiliza en pantallas (ej. CambioContrasena) para limpiar los sessionStorage y otro contenido que pueda quedar de la sesion
}
