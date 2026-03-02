import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
    useCallback,
    Dispatch,
    SetStateAction,
} from "react";
import { logoutUsuario } from "../services/EliminacionCookie";
import { toast } from "sonner";
import { useSessionPoll } from "../hooks/UseSessionPoll";
import Modal from "../Components/shared/ModalComponents/modalComponent";
// import { useSessionTimeout } from "../hook/UseSessionTimeout";


type SessionState<T> = [T, Dispatch<SetStateAction<T>>];//esto sirve para crear un hook personalizado "<SetStateAction<T>>" ya que con esto establecemos 
// un estado entonces el type SessionState devuelve [valor, setter]
function useSessionStorageState<T>( //este es un custom hook que se extiende de useState
    key: string, //key es la clave que se guarda/recupera del sessionStorage
    defaultValue: T // este es el valor inicial si no hay nada almacenado
): SessionState<T> { //es de tipo SessionState
    const [state, setState] = useState<T>(() => {
        const raw = sessionStorage.getItem(key); //obtiene el item que se le pasa del sessionStorage
        if (!raw) return defaultValue; //si no existe la clave entonces devuelve el valor por defecto
        try {
            return JSON.parse(raw) as T;
            // return raw as T;
        } catch {
            return defaultValue;
        }
    });
    useEffect(() => {//este useEffect se disparara cada vez que cambie la clave o el estado 
        if (state == null) {
            sessionStorage.removeItem(key); //si el estado es nulo entonces remueve la clave
        } else {
            sessionStorage.setItem(key, JSON.stringify(state)); //guarda el valor para la clave
            // sessionStorage.setItem(key, state);
        }
    }, [key, state]);
    return [state, setState]; //retorna el state y el setter setState igual que un hook useState
}

type User = { //define lo que contendra el objeto con tipo user 
    nombre?: string;
    municipalidades?: string[];
    token?: string;
    email?: string;
    temporaryPassword?: string;
};

interface AuthContextProps { //en esta interfaaz se definen todos los valores y funciones que el 
    // AuthContext.Provider pondra a disposicion de toda la app 
    user: User | null; //el valor de user
    setUser: Dispatch<SetStateAction<User | null>>; //el respectivo setter para el valor del user
    token: string | null; //el valor de token
    setToken: Dispatch<SetStateAction<string | null>>;//el respectivo setter para el valor del token
    identifier: string | null;
    setIdentifier: Dispatch<SetStateAction<string | null>>;//el respectivo setter para el valor del token
    tokenOT: string | null; //el valor de token
    setTokenOT: Dispatch<SetStateAction<string | null>>;//el respectivo setter para el valor del token
    selectedMunicipality: string | null;//el valor de selectedMunicipality
    setSelectedMunicipality: Dispatch<SetStateAction<string | null>>;//el respectivo setter para el valor de selectedMunicipality 
    logout: () => void; // función para cerrar sesión y limpiar todo el estado de autenticación.
    refreshToken: () => Promise<void>; //función para pedir un nuevo access token al servidor backend y actualizarlo.
    newLogin: boolean;
    setNewLogin: Dispatch<SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);//aqui se crea un contexto de react el cual llevara los datos
//  de autenticacion que sera de tipo AuthContextProps y por defecto tendra valor indefinido
//Esto permite que, cuando uses useContext(AuthContext), TypeScript conozca exactamente
//  qué propiedades y métodos (user, token, logout, etc) estarán disponibles.

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => { // Aqui se define un componente funcional que es un componente que recibe props y devuelve TSX 
    //Este componente será el envoltorio (wrapper) que provee (via <AuthContext.Provider>) los valores de autenticación a todos sus hijos, permitiendo que luego se use useAuth() dentro de ellos.
    const [user, setUser] =
        useSessionStorageState<User | null>("userPayload", null);
    const [token, setToken] =
        useSessionStorageState<string | null>('access_TKN', null);//hook para guardar estado en session storage
    const [tokenOT, setTokenOT] =
        useSessionStorageState<string | null>('access_TKN_OT', null);//hook para guardar estado en session storage
    const [selectedMunicipality, setSelectedMunicipality] =
        useSessionStorageState<string | null>("selectedMunicipality", null);
    const [identifier, setIdentifier] =
        useSessionStorageState<string | null>("identifier", null);

    const [newLogin, setNewLogin] = useState<boolean>(false); //hook de estado usado para mostrar la modal de nuevo inicio de sesion

    const logout = useCallback(async () => {//cuando se usa useCallback hacemos que esta sea una funcion asincrona memorizada 
        // es decir que solo cambiara si cambian las dependencias al final 

        if (token)
            try {
                await logoutUsuario(token as string);// envía petición al backend para invalidar la cookie HTTP-only.
            } catch (error) {
                console.error("Error al destruir cookie en logout:", error);
            } finally {
                // Limpia estado persistido y se usa esta sintaxis ya que si se usa la sintaxis de los hooks entonces no se puede usar el reload
                sessionStorage.removeItem("access_TKN");//este existe en cambio de contraseña inicial y reseteo de contraseña
                sessionStorage.removeItem("userPayload");//este existe en cambio de contraseña inicial
                sessionStorage.removeItem("selectedMunicipality");//este existe en general y se le agrega valor cuando selecciona una Muni
                sessionStorage.removeItem("identifier");//este existe en general y se le agrega valor cuando selecciona una Muni
                // setUser(null);//el valor de user para el sessionStorage queda en null
                // setSelectedMunicipality(null); //el valor de selectedMunicipality para el sessionStorage queda en null
                // setToken(null); //el valor de token para el sessionStorage queda en null
                // setIdentifier(null);
                //ver posibilidad de borrar hooks de arriba que esta actualmente comentados
            }
    }, [token, setUser, setSelectedMunicipality, setToken, setIdentifier]); //estas son las dependencias de useCallback es decir que si 
    // alguna cambia entonces React craeara esta funcion de lo contrario reutilizara la misma instancia para evitar renders extras

    const refreshToken = useCallback(async () => {// Se declara una funcion asincrona la cual no se vuelve a crear a menos que cambie token o setToken
        if (!token) return;//si no hay token sale de la funcion
        const apiURL = import.meta.env.VITE_API_URL;
        console.log("token en funcion refreshToken: ", token);

        try {
            const resp = await fetch(
                `${apiURL}/refresh_AcTkn`,
                {
                    method: "POST",
                    credentials: "include",//permite que envie cookies por ejemplo del token de refresh guardado en HttpOnly
                    headers: { Authorization: `Bearer ${token}` },// incluye el token actual para poder consumir endpoint
                }
            );
            const authHeader = //aqui intenta leer el nuevo access_token que viene del backend
                resp.headers.get("Authorization") ||
                resp.headers.get("authorization") ||
                resp.headers.get("x-access-token");

            if (!authHeader) {
                console.error("No llegó ningún header con el token desde el backend"); //si no existe ningun header con el token
                // setUser(null);
                // setSelectedMunicipality(null);
                // setToken(null);
                // toast.info("Su sesion ha expirado.");
                return;
            }
            const newToken = authHeader.startsWith("Bearer ")//si el header comienza con Bearer
                ? authHeader.slice(7)//entonces corta los primeros caracteres
                : authHeader;//si no comienza con bearer lo deja como esta
            console.log("El nuevo token que llego en la funcion refreshToken en AuthContext", newToken);
            setToken(newToken);// hace que el token se actualice con el hook personalizado en sessionStorage y tambien en el estado de contexto AuthContext
        } catch (err) {
            console.error("Error al renovar token:", err);//Imprime error al renovar token
        }
    }, [token, setToken]);//se usa useCallback porque esto asegura que la funcion refreshToken solo cree nuevamente si 
    // token o setToken cambian, esto es util ya que este hook se pasa a otros componentes como useSessionTimeOut el 
    // cual depende de su estabilidad

    // useSessionPoll({ // se instancia el hook para estar revisando el estado de la sesion actual 
    //     intervalMs: 45_000,
    //     getToken: () => token,
    //     onInvalid: () => {
    //         console.log("Se deberia mostrar la modal de inicio de sesion");
    //         //setNewLogin(true);
    //         //logout();
    //         //se procede a cerrar sesion si el endpoint retorna en su respuesta que la sesion actual es invalida
    //     },
    // });

    return (
        <AuthContext.Provider
            value={{//todo lo que esta dentro de value sera lo que estara disponible para cualquier componente que use useAuth()
                //aqui se comparten estados(valores en memoria), sus setters y funciones utiles como refreshToken y logOut
                user,
                setUser,
                identifier,
                setIdentifier,
                token,
                setToken,
                tokenOT,
                setTokenOT,
                selectedMunicipality,
                setSelectedMunicipality,
                logout,
                refreshToken,
                newLogin,
                setNewLogin,
            }}
        >
            {children} {/* Esta linea envuelve todos los componentes hijos con el contexto de autenticacion*/}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = useContext(AuthContext); //aqui instanceamos en la constante context lo que seria el contexto actual de AuthContext
    if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider"); //si se usa fuera de AuthProvider lanza este error
    return context;//retornamos el contexto

    //Gracias a esto podemos hacer lo siguiente dentro del aplicativo siempre y cuando este envuelto en el contexto de Autenticacion
    //Por ejemplo se puede usar esto en otra parte del aplicativo "const { token, logout } = useAuth();"

}