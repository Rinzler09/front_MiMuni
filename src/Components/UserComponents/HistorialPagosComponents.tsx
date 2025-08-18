import React, { useState, useEffect } from "react";//Importacioon de libreria de React y sus hooks useState y useEffect
import "../../style/UserInfoStyles/historialFacturas.css";//Importacion del estilo historialFacturas.css
import { GrPowerReset } from "react-icons/gr";//Importancion de icono de refrescar desde la libreria react-icons
import { LiaFileInvoiceSolid } from "react-icons/lia";//Importacion de icono de factura desde la libreria react-icons
import Skeleton from "react-loading-skeleton"; //Libreria que viene para utilizar skeleton
import "react-loading-skeleton/dist/skeleton.css";// Importancion de Skeleton


/* Se define la interface facturas con su tipo de dato */
import Skeleton from "react-loading-skeleton"; //Libreria que viene para utilizar skeleton
import "react-loading-skeleton/dist/skeleton.css";// Importancion de Skeleton
interface Facturas {//Esta la funcion de interface que nos ayuda para poder definir un tipo de dato
  id: number; // Idenficador unico para cada factura
  descripcion: string;// Descripcion de la factura
  subtotal: number;//subtotal de la factura
  valortotal: number;//valor total de la factura
  fechapago: string;//fecha de pago de la factura
  periodo: number;//Periodo de la factura
  estado: string;//estado de la factura
}


const HistorialPagos: React.FC = () => {

  /*Se use el hook de useState para el arreglo de Facturas*/
<<<<<<< HEAD
  const [historialFacturas, sethistorialFacturas] = useState<Facturas[]>([]);
=======
  const [historialFacturas, setHistorialFacturas] = useState<Facturas[]>([]);
>>>>>>> e04d54e122ad258d89e6c059190cb2aba175a9f8
  const [loading, setLoading] = useState(true);// se declara un const para loading
  const [paginaActual, setPaginaActual] = useState(1);//Estado para la paginacion actual, con el estado de hook useState
  const registrosPorPagina = 5;//Esta contante utiliza el numero de registro por paginacion

  //se calculan los indices para las paginas actuales
  const indUltimoReg = paginaActual * registrosPorPagina;//
  const indPrimerReg = indUltimoReg - registrosPorPagina;
<<<<<<< HEAD
  const registrosActuales =  historialFacturas.slice(indPrimerReg, indUltimoReg);
  const pagsTotales = Math.ceil(historialFacturas.length / registrosPorPagina);
  const handleCambioPag = (numPag: number) => setPaginaActual(numPag);
=======
  const registrosActuales = historialFacturas.slice(indPrimerReg, indUltimoReg);
  const pagsTotales = Math.ceil(historialFacturas.length / registrosPorPagina);
  const handleCambioPag = (numPag: number) => {
    setPaginaActual(numPag);
  }
>>>>>>> e04d54e122ad258d89e6c059190cb2aba175a9f8

  /* REALIZADO POR MARLEY */
  const [selectedOption, setSelectedOption] = useState(""); // Track selected dropdown option

  const handleRefreshClick = () => {
    //En esta parte tendra que implementar la logica para refrescar las facturas
  };


  const handleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value); // Update selected option
  };

<<<<<<< HEAD
  //Agregacion de useEffect para poder agregar 
  useEffect(() => {
    const fetchHistorialPagos = async () => {
      
      setLoading(true);
      try {
        
      } catch (error) {
        
      }finally{
=======
  //Agregacion de useEffect para poder agregar
  useEffect(() => {
    const fetchHistorialPagos = async () => {

      setLoading(true);
      try {

      } catch (error) {

      } finally {
>>>>>>> e04d54e122ad258d89e6c059190cb2aba175a9f8
        setLoading(false);
      }

    };

    fetchHistorialPagos();
  }, [historialFacturas]);

  return (
    <div className="historialFacturas">{/**tenemos la primera parte en donde se muestra la clase principal*/}
      <h2 className="title">HISTORIAL DE FACTURACION</h2>{/**El titulo que se muestra en la parte de facturacion*/}

      {/* Date Range Filter */}
      <div className="historial-facturacion-container">{/**En este apartado tenemos el contenedor de los  bloques de los filtros de busqueda y por fechas*/}

        <div className="date-range-container">{/**En una clase personalizada, en donde viene de Historial de pago Components*/}
          <div className="date-range-filter">{/**Tenemos la parte de los filtros de fechas */}
            <select className="selectInvoice" onChange={handleOptionChange}>{/**Select, es un etiqueta en donde podemos seleccionar las opciones que nos ofrecen*/}
              <option style={{ background: "#FFFFFF", color: "black" }}>{/**Option es parte de la etiqueta de Select para poder elegir una eleccion.*/}
                Tipo de factura
              </option>
              <option style={{ background: "#FFFFFF", color: "black" }}>
                BI-Bienes Inmuebles
              </option>

            </select>

            <input type="date" defaultValue="dd-mm-yyyy" className="date-inicio" />{/**En esta parte tenemos un input en donde pasamos la parte de fecha */}

            <input type="date" defaultValue="yyy-mm-dd" className="date-final" />{/**En esta parte tambien tenemos un input con el type de fecha*/}

            <button className="buttonReset" title="Buscar Facturas"
              onClick={handleRefreshClick}><GrPowerReset /></button>{/**Este boton nos ayuda poder refrescar la factuaras actuales*/}

            <button className="buttonInvoices" title="Descargar PDF"><LiaFileInvoiceSolid /></button>{/**Tenemos el segundo boton en donde podemos descargar sin ningun problema los documentos*/}
          </div>
        </div>
      </div>
      {/* Tabla de Facturas - Realizado por Milton Paz*/}

      <div className="table-responsive">
        <table className="details-table">{/**En este caso tenemos las tablas que se le mostrarar en la parte del diseño al usuario*/}
          <thead>
            <tr>
              <th>N°FACTURA</th>{/**Tenemos la primera parte de Factura*/}
              <th>DESCRIPCION</th>{/**Tenemos la primera parte de Descripcion*/}
              <th>SUBTOTAL</th>{/**Tenemos la primera parte de Subtotal*/}
              <th>VALORTOTAL</th>{/**Tenemos la primera parte de ValorTotal*/}
              <th>FECHAPAGO</th>{/**Tenemos la primera parte de FechaPago*/}
              <th>PERIODO</th>{/**Tenemos la primera parte de Periodo*/}
              <th>ESTADO</th>{/**Tenemos la primera parte de Estado*/}

<<<<<<< HEAD
          </tr>
        </thead>
        <tbody>
          {loading
              // Mientras carga, dibuja  registrosPorPagina filas de skeleton con 11 celdas cada una
                ? Array.from({ length: registrosPorPagina }).map((_, i) => (
                  <tr key={i}>
                {Array.from({ length: 7 }).map((__, j) => (
                <td key={j} style={{ textAlign: "center" }}>
                <Skeleton height={20} />
                </td>
                ))}
                </tr>
                ))

                : registrosActuales.map((registro, i) => (
                <tr key={i}>
    
=======
            </tr>
          </thead>

          <tbody>
            {loading
              // Mientras carga, dibuja  registrosPorPagina filas de skeleton con 11 celdas cada una
              ? Array.from({ length: registrosPorPagina }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 7 }).map((__, j) => (
                    <td key={j} style={{ textAlign: "center" }}>
                      <Skeleton height={20} />
                    </td>
                  ))}
                </tr>
              ))

              : registrosActuales.map((registro, i) => (
                <tr key={i}>

>>>>>>> e04d54e122ad258d89e6c059190cb2aba175a9f8
                  <td>{registro.id}</td>
                  <td>{registro.descripcion}</td>
                  <td>{registro.subtotal}</td>
                  <td>{registro.valortotal}</td>
                  <td>{new Date(registro.fechapago).toLocaleDateString()}</td>
                  <td>{registro.periodo}</td>
                  <td>{registro.estado}</td>
<<<<<<< HEAD
    
                </tr>
              ))}

              {!loading && historialFacturas.length === 0 && (
                <tr>
                  <td colSpan={7} style={{textAlign: "center"}}>
                    NO HAY DATOS QUE MOSTRAR
                  </td>
                </tr>
              )}
            
        </tbody>
      </table>

      {pagsTotales > 1 && !loading && (
        <div className="pagination">
          {Array.from({length: pagsTotales}, (_, i) => (
            <button key={i + 1} onClick={() => handleCambioPag(i +1)}>
              {i + 1}
            </button>
          ))}
        </div>
      )}


      <br />
      <nav>
=======

                </tr>
              ))}

            {!loading && historialFacturas.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center" }}>
                  NO HAY DATOS QUE MOSTRAR
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {/* ANALIZAR: la funcionalidad cuando ya tenga resgistros en la parte de paginacion */}
        {pagsTotales > 1 && !loading && (
          <div className="pagination">
            {Array.from({ length: pagsTotales }, (_, i) => (
              <button key={i + 1} onClick={() => handleCambioPag(i + 1)}>
                {i + 1}
              </button>
            ))}
          </div>
        )}

      </div>
      {/* <nav>
>>>>>>> e04d54e122ad258d89e6c059190cb2aba175a9f8
        <ul className="pagination">
          {[...Array(pagsTotales).keys()].map((page) => (
            <li
              key={page}
              className={`page-item ${paginaActual === page + 1 ? 'active' : ''}`}
              onClick={() => handleCambioPag(page + 1)}
            >
              <a className="page-link" href="#!">
                {page + 1}
              </a>
            </li>
          ))

          }
        </ul>
      </nav> */}
    </div>
  );
};

export default HistorialPagos;