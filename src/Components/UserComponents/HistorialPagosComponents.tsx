import React, { useState, useEffect } from "react";//Importacioon de libreria de React y sus hooks useState y useEffect
import "../../style/UserInfoStyles/historialFacturas.css";//Importacion del estilo historialFacturas.css
import { GrPowerReset } from "react-icons/gr";//Importancion de icono de refrescar desde la libreria react-icons
import { LiaFileInvoiceSolid } from "react-icons/lia";//Importacion de icono de factura desde la libreria react-icons
import { CiSearch } from "react-icons/ci";
import Skeleton from "react-loading-skeleton"; //Libreria que viene para utilizar skeleton
import "react-loading-skeleton/dist/skeleton.css";// Importancion de Skeleton
import { TbReportAnalytics } from "react-icons/tb";
import { ToastContainer, toast } from "react-toastify"; //Es para agregar el toastify
import 'react-toastify/dist/ReactToastify.css';//Es para el diseño de css que viene con la libreria
import { set } from "react-hook-form";


/* Se define la interface facturas con su tipo de dato */

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
  const [historialFacturas, setHistorialFacturas] = useState<Facturas[]>([]);
  const [loading, setLoading] = useState(true);// se declara un const para loading
  const [paginaActual, setPaginaActual] = useState(1);//Estado para la paginacion actual, con el estado de hook useState
  const registrosPorPagina = 5;//Esta contante utiliza el numero de registro por paginacion

  //se calculan los indices para las paginas actuales
  const indUltimoReg = paginaActual * registrosPorPagina;//
  const indPrimerReg = indUltimoReg - registrosPorPagina;
  const registrosActuales = historialFacturas.slice(indPrimerReg, indUltimoReg);
  const pagsTotales = Math.ceil(historialFacturas.length / registrosPorPagina);
  const handleCambioPag = (numPag: number) => {
    setPaginaActual(numPag);
  }

  /* REALIZADO POR MARLEY */
  const [selectedOption, setSelectedOption] = useState(""); // Track selected dropdown option

  const handleRefreshClick = () => {
    //La implementacion para poner retriccion en los filtros
    const seleccionFacturacion = selectedOption;

    //Condicion de restriccion para usuario
    if (!seleccionFacturacion) {
      //Si la seleecion es vacio mostrara una alerta diciendo que seleccione una opcion
      toast.info("Por favor seleccione una opcion de tipo de facturas" )
      return;
    }
    
    //Limpiar registros actuales en la tabla si aun caso el contribuyente selecciona la opcion de tipo de factura
   //setHistorialFacturas([]);
    
   //En esta parte tendra que implementar la logica para refrescar las facturas
  setHistorialFacturas(
      [
        {
          id: 22,
          descripcion: "Impuesto Bien Inmueble Periodo 2016",
          subtotal: 390.73,
          valortotal: 410.73,
          fechapago: "08/09/16",
          periodo: 2016,
          estado: "P",
        },
        {
          id: 23,
          descripcion: "Impuesto Bien Inmueble Periodo 2017",
          subtotal: 415.39,
          valortotal: 450.60,
          fechapago: "12/12/17",
          periodo: 2017,
          estado: "P",
        }
      ]
    )
  };

  //Funcion para manera la descargas de PDF
  const handleDownloadPdf = () => {
    toast.success("Descargando PDF...");
  }


  const handleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value); // Update selected option
  };

  //Agregacion de useEffect para poder agregar
  useEffect(() => {
    const fetchHistorialPagos = async () => {

      setLoading(true);
      try {

      } catch (error) {

      } finally {
        setLoading(false);
      }

    };

    fetchHistorialPagos();
  }, [historialFacturas]);

  return (
     
       
      
    <div className="historialFacturas">{/**tenemos la primera parte en donde se muestra la clase principal*/}
      
      <h2 className="title" >HISTORIAL DE FACTURACION</h2>{/**El titulo que se muestra en la parte de facturacion*/}

      {/* Date Range Filter */}
      <div className="historial-facturacion-container">{/**En este apartado tenemos el contenedor de los  bloques de los filtros de busqueda y por fechas*/}
        <ToastContainer/>
        <div className="date-range-container">
        <div className="filters-grid">
        <select className="selectInvoice" onChange={handleOptionChange} aria-label="Tipo de factura">
        <option value="">Tipo de factura</option>
        <option>BI-Bienes Inmuebles</option>
        </select>
        <input type="date" className="date-inicio" aria-label="Fecha inicio" />
        <input type="date" className="date-final" aria-label="Fecha fin" />

        <div className="actions">
        <button className="buttonReset" title="Buscar Facturas" onClick={handleRefreshClick}>
        <CiSearch />
        <span>Buscar</span>
        </button>
        
        
        </div>
        </div>
        </div>
      </div>
      {/* Tabla de Facturas - Realizado por Milton Paz*/}

      <div className="table-responsive-historial">
        <table className="details-table table table-hover table-sm align-middle w-100">{/**En este caso tenemos las tablas que se le mostrarar en la parte del diseño al usuario*/}
          <thead className="table-light">
            <tr>
              <th>N°FACTURA</th>{/**Tenemos la primera parte de Factura*/}
              <th>DESCRIPCION</th>{/**Tenemos la primera parte de Descripcion*/}
              <th>SUBTOTAL</th>{/**Tenemos la primera parte de Subtotal*/}
              <th>VALORTOTAL</th>{/**Tenemos la primera parte de ValorTotal*/}
              <th>FECHAPAGO</th>{/**Tenemos la primera parte de FechaPago*/}
              <th>PERIODO</th>{/**Tenemos la primera parte de Periodo*/}
              <th>ESTADO</th>{/**Tenemos la primera parte de Estado*/}
              <th>PDF</th>

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
                <tr key={i} >

                  <td style={{ textAlign: "center" }}>{registro.id}</td>
                  <td style={{ textAlign: "center" }}>{registro.descripcion}</td>
                  <td style={{ textAlign: "center" }}>{registro.subtotal}</td>
                  <td style={{ textAlign: "center" }}>{registro.valortotal}</td>
                  <td style={{ textAlign: "center" }}>{new Date(registro.fechapago).toLocaleDateString()}</td>
                  <td style={{ textAlign: "center" }}>{registro.periodo}</td>
                  <td style={{ textAlign: "center" }}>{registro.estado}</td>
                  <td><button className="buttonPdf" onClick={handleDownloadPdf}><TbReportAnalytics /></button></td>
                </tr>
              ))}

            {!loading && historialFacturas.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center" }}>
                  SELECCIONA UNA DE LAS OPCIONES Y DA CLICK EN BUSCAR PARA CARGAR EL HISTORIAL DE PAGOS
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