// src/components/DetallesImpuesto.tsx
import React, { useState, useEffect } from "react";//Estamos declarando el hook de useState para poder integrar la parte de boolean
import { useNavigate } from "react-router-dom";
import {  toast } from "sonner";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "../../style/ImpuestosStyles/detalleBienInmueble.css";
import { clavesCatastrales } from "../../services/claveCatastral";
import { facturaBienesInmueble } from "../../services/facturasBI";
import { useAuth } from "../../Auth/AuthContext";
import { mensajes } from "../../util/message";

interface Claves {
  prop: string;
  claveCat: string;
  valorImp: string;
  uso: string;
  subUso: string;
  aldea: string;
  barrio: string;
  direccion: string;
}

const DetallesImpuesto: React.FC = () => {
  const navigate = useNavigate();
  const {  selectedMunicipality, token } = useAuth();
  // const token = user?.token;


  const [claves, setClaves] = useState<Claves[]>([]);
  const [loading, setLoading] = useState(true);//En tenemos una contasnte que contiene loading y setloading con el hook useState(true)
  //Esto no ayudara cuando el argumento que pasas a useState que en este caso es true se establece al valor inicial que ne este coso viene siendo loading
  //Por ejemplo loading === true eso indica que esta teniendo un estado que esta cargando 
  const [paginaActual, setPaginaActual] = useState(1);//Proceso de la paginacion 
  const registrosPorPagina = 5;//Declaracion del registro de paginas.

  useEffect(() => {
    if (!selectedMunicipality || !token) return;

    const fetchClaves = async () => {
      
      setLoading(true);/**En este caso el setLoading hace referencia que antes de llamar los registros este en estado loading en true, esto es para que cuando este esperando datos
       * muestre el skeleton mientras se este cargando los datos completos, en este caso se mostrara 5 filas 5 
      */
      try {
        const respuesta = await clavesCatastrales(selectedMunicipality, token);
        //  console.log(" respuesta API clavesCatastrales:", respuesta);
        //  console.log("VIENE DE LA API:", clavesCatastrales);

        // 1) Extraemos array: puede venir directamente o en respuesta.data
        const rawArray = Array.isArray(respuesta)
          ? respuesta
          : Array.isArray((respuesta as any).data)
            ? (respuesta as any).data
            : null;

        if (!rawArray) {
          console.error("La API no devolvió un array:", respuesta);
          toast.error("La API no devolvió datos de inmuebles.");
          setClaves([]);
          return;
        }

        // 2) Mapeamos campos a nuestra interfaz Claves
        const datos: Claves[] = rawArray.map((item: any) => ({
          prop: item.prop ?? item.propietario ?? "—",
          claveCat: item.claveCat ?? item.clave_catastral ?? "—",
          valorImp: item.valorImp ?? item.valor_impuesto ?? "—",
          uso: item.uso ?? item.uso_predominante ?? "—",
          subUso: item.subUso ?? item.sub_uso ?? "—",
          aldea: item.aldea ?? item.nombre_aldea ?? "—",
          barrio: item.barrio ?? item.caserio ?? "—",
          direccion: item.direccion ?? item.domicilio ?? "—",
        }));

        setClaves(datos);
      } catch (error: any) {
        console.error("Error fetchClaves:", error);
        toast.error(mensajes["Error al obtener facturas para este bien inmueble"].mensaje);
      } finally {//En este caso se utiliza la parte de finally asegurando que siempre se desactive, ante que eso sueceda tiene que pasar primero todo el trycatch, 
        //Pero siempre se va ejecutar el finally a pesar de encontrar un error, esto nos ayuda que se detenga la parte de skeleton al momento de encontrar un resultado o mensaje,
        setLoading(false);//Esto nos ayuda poder tener el skeleton cuando ya se encuentre un resultado por eso estamos usando la parte de finally
      }
    };

    fetchClaves();// Esto siempre va de la mano para el skeleton funcione correctamente el skeleton
  }, [selectedMunicipality]);

  // Paginación, es donde calcula el indice del ultimo registro en la paginacion actual
  const indUltimoReg = paginaActual * registrosPorPagina;// En esta parte estan diciendo que si (PaginaActual) Vale 1 y (registrosPorPagina) vale 10 entonces, 
  // indUltimoReg = 1 * 10 = 10, para la paginaActual = 2, indUltimoReg = 2 * 10 = 10, entonces este valor representa la posicion "Uno. pasado"

  const indPrimerReg = indUltimoReg - registrosPorPagina;// Tenemos el indUltimoReg que eso equivale = 10 y registroPorPagina = 10, indPrimerReg = 10 - 10 = 0
  //En la pagina 2 (indUltimoReg = 20), indPrimerReg = 20 - 10 = 10, significa que este valor es el indice desde el actual empezamos a extraer elementos.
  
  const registrosActuales = claves.slice(indPrimerReg, indUltimoReg);//El método slice(start, end) devuelve los elementos del array desde start (inclusive) hasta end (exclusive).
  //La pagina 1, Clave:slice(0,10) esto es que los primeros 10 elementos (0, 9)
  //para la pagina 2, clave.slice(10,20), los elementos de la posicion 10, al 19.
  
  const pagsTotales = Math.ceil(claves.length / registrosPorPagina);//En la parte de Math.ceil es el total del elementos en el array, 
  //Dividiendo por registrosPorPagina obtenemos cuantas paginas completas caben, esto quiere decir que si hay 45 registros y 10 por paginas es 
  //45 / 10 = 4.5 pero como usamos el Math.ceil(4.5) = 5

  const handleCambioPag = (numPag: number) => setPaginaActual(numPag);

  const handleVerFacturas = async (claveCat: string, direccion: string) => {
    if (!selectedMunicipality || !token) {
      toast.error("Debe iniciar sesión y seleccionar municipalidad.");
      return;
    }
    try {
      const facturaResponse = await facturaBienesInmueble(
        selectedMunicipality,
        claveCat,
        token
      );
      toast.success("Factura generada para proceso de pago.");
      navigate("/facturas-BI", {
        state: { municipalidad: selectedMunicipality, claveCat, direccion, facturaData: facturaResponse }
      });
    } catch {
      toast.error(mensajes["Error al obtener facturas para este bien inmueble"].mensaje);
    }
  };

  return (
    <div className="detalles-impuesto-container">

      <h2 className="title">LISTADO DE BIENES INMUEBLES</h2>      

    <div className="table-responsive">
        <table className="details-table table table-hover table-sm align-middle w-100">
        <thead className="table-light">
          <tr>
            <th>Propietario</th>
            <th>Clave Catastral</th>
            <th>Valor Impuesto</th>
            <th>Uso</th>
            <th>Sub Uso</th>
            <th>Aldea</th>
            <th>Barrio/Caserio</th>
            <th>Dirección</th>
            <th>Ver Facturas</th>
          </tr>
        </thead>
        <tbody>
          {loading //En este caso vamos utilizar el loading en este caso ya es booleano, quiere decir que si es true, va rederizar el bloque de Skeleton 
                   //Ya si es false esto redenrizaria la parte de los datos que se esta extrayendo la informacion que viene en la arreglo de la API. 

            // Mientras carga, mostramos skeletons
            ? Array.from({ length: registrosPorPagina }).map((_, i) => (//En este caso tenemos un arrelgo en donde tenemos la logintud de registrosPorPagina
              //En este caso tenemos 10 paginas
              <tr key={i}>
                {Array.from({ length: 9 }).map((__, j) => (//Tenemos un arreglo de 9 posisiones en donde no tiene ningun dato,
                //de esta menera vamos a mostrar 9 columnas de skeletons, tenemos la parte de .map en donde se convierte en un nuevo arreglo
                //y para cada uno de los elementos del arreglo, se crea una celda <td> con un Skeleton dentro. 
                  <td key={j} style={{ textAlign: "center" }}>{/**En este caso tenemos el porcentaje del indice j donde tendra el key={j}
                  ayuda que manejar la eficiencia de la lista de los elementos*/}
                    <Skeleton height={20} />{/**En este caso es la libreria que dibuja un rectangulo gris de 20px de alto con animacion de brillo*/}
                  </td>//En este caso tenemos la parte 
                ))}
              </tr>
            ))
            // Una vez cargado, los datos reales
            : registrosActuales.map((item, i) => (
              <tr key={i}>
                <td style={{ textAlign: "center" }}>{item.prop}</td>
                <td style={{ textAlign: "center" }}>{item.claveCat}</td>
                <td style={{ textAlign: "center" }}>L{item.valorImp}</td>
                <td style={{ textAlign: "center" }}>{item.uso}</td>
                <td style={{ textAlign: "center" }}>{item.subUso}</td>
                <td style={{ textAlign: "center" }}>{item.aldea}</td>
                <td style={{ textAlign: "center" }}>{item.barrio}</td>
                <td style={{ textAlign: "center" }}>{item.direccion}</td>
                <td>
                  <button
                    className="btnFacturas"
                    onClick={() => handleVerFacturas(item.claveCat, item.direccion)}>Facturas</button>
                </td>
              </tr>
            ))}

            {/*
              Si NO estamos cargando datos (!loading)
              Y el arreglo (claves) está vacío (claves.length === 0),
              mostramos una unica fila en la tabla indicando que no hay datos
            */}
          {!loading && claves.length === 0 && (
            <tr>
              <td colSpan={9} style={{ textAlign: "center" }}>{/**Estamos usando el colpsan que indican que esta celda debe abarcar 9 columnas
               * de la tabla en lugar de sola 1, y estamos usando el style con textAlign: "center" centra horizontalmente el texto dentro de la celda.
              */}
                No hay datos que mostrar
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

      {/*
        Si el numero total de paginas (pagsTotales) es mayor que 1
        Y NO estamos cargando !loading,
        mostramos los controles de paginacion.
      */}

      {pagsTotales > 1 && !loading && (
        <div className="pagination">
            {/*
              Generamos un array de longitud pagsTotales, y para cada índice i creamos un botón:
              key={i+1} clave única  para cambiar a la página correspondiente.
              El texto del botón es el número de página (i+1).
            */}
          {Array.from({ length: pagsTotales }, (_, i) => (
            <button key={i + 1} onClick={() => handleCambioPag(i + 1)}>
              {i + 1}
            </button>
          ))}
        </div>
      )}
      </div>
    
  );
};

export default DetallesImpuesto;
