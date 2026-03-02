import React, { useState, useEffect, useCallback } from "react";//Importacioon de libreria de React y sus hooks useState y useEffect
import "../../style/UserInfoStyles/historialFacturas.css";//Importacion del estilo historialFacturas.css
import { FaSearch, FaEye } from "react-icons/fa";
import { PaginationControl } from 'react-bootstrap-pagination-control';
import Skeleton from "react-loading-skeleton"; //Libreria que viene para utilizar skeleton
import "react-loading-skeleton/dist/skeleton.css";// Importancion de Skeleton
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Auth/AuthContext";
import { toast } from "sonner";
import { facturasPagadas } from "../../services/facturasPagadas";
import { facturasPagadas_F } from "../../services/facturasPagadas_F";

/* Se define la interface facturas con su tipo de dato */

interface FacturasPagadas {//Esta la funcion de interface que nos ayuda para poder definir un tipo de dato
  NoFactura: number;
  ClaveCatastral: string;
  Descripcion: string;
  ValorFacturado: number;
  ValorPagado: number;
  FechaPago: string;
  FechaVence: string;
  NoRecibo: number;
  TipoFactura: string;
}

type Option = { label: string; value: string };


const HistorialPagos: React.FC = () => {

  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const { selectedMunicipality, token } = useAuth();
  const [selectedTax, setSelectedTax] = useState("ALL"); // Track selected dropdown option
  const facturasOptions: Option[] = [
    { label: 'Todas (cualquier fecha)', value: 'ALL' },
    { label: 'Bienes Inmuebles', value: 'BI' },
    { label: 'Impuesto Vecinal', value: 'IP' },
    { label: 'Servicios Publicos', value: "SP" },
    { label: 'Impuesto Industria, C y S', value: 'IC' },
    { label: 'Plan de Pago', value: "PP" },
    { label: 'Servicios Varios', value: 'OT' },
  ];
  // const [clavesCat, setClavesCat] = useState<string[]>([""]);
  const [clavesCat, setClavesCat] = useState<string[]>([""]);
  const [selectedClaveCat, setSelectedClaveCat] = useState<string>("");

  /*Se use el hook de useState para el arreglo de Facturas*/
  const [historialFacturas, setHistorialFacturas] = useState<FacturasPagadas[]>([]);
  const [loading, setLoading] = useState(true);// se declara un const para loading
  const [paginaActual, setPaginaActual] = useState(1);//Estado para la paginacion actual, con el estado de hook useState
  const registrosPorPagina = 5;//Esta contante utiliza el numero de registro por paginacion

  //se calculan los indices para las paginas actuales
  const indUltimoReg = paginaActual * registrosPorPagina;//
  const indPrimerReg = indUltimoReg - registrosPorPagina;
  const registrosActuales = historialFacturas.slice(indPrimerReg, indUltimoReg);
  const handleCambioPag = (numPag: number) => setPaginaActual(numPag);


  const handleTaxChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // console.log("parametro seleccionado: ", e.target.value)
    setSelectedTax(e.target.value); // Update selected option

    if (e.target.value === "BI") {
      console.log("La primera clave cata: ", clavesCat?.[0]);
      setSelectedClaveCat(clavesCat?.[0]);//se define como predeterminado el primer valor de las claves catastrales
    } else {
      setSelectedClaveCat("");
    }
  };

  const fetchHistorialPagos = useCallback(async () => {
    setPaginaActual(1);
    setLoading(true);

    if (!selectedMunicipality) {
      toast.error("No se ha seleccionado una Municipalidad, no cargara registros de facturas.");
      setLoading(false);
      return;
    }

    try {
      const respuesta: FacturasPagadas = await facturasPagadas(selectedMunicipality, token);
      console.log("Esta es la respuesta de las facturas pagadas: ", respuesta);

      if (respuesta && Array.isArray(respuesta)) {
        setHistorialFacturas(respuesta)
        setClavesCat([
          ...new Set(//sae usa new Set para eliminar valores duplicados del arreglo que se esta enviando
            respuesta.filter((factura) => factura.ClaveCatastral)//con filter solo se mantienene las facturas donde exista el valor para la key ClaveCatastral
              .map((factura) => factura.ClaveCatastral)//con map se extraen solo los valores de las keys claveCatastral de los objetos
          )
        ]);
        // console.log("La primera clave cata: ", respuesta?.[0]?.ClaveCatastral);
        //setSelectedClaveCat(respuesta?.[0]?.ClaveCatastral);//se define como predeterminado el primer valor de las claves catastrales
      }

    } catch (error) {
      console.log("Error obteniendo registros:", error);
      if (error === "Error: No hay facturas disponibles") setHistorialFacturas([]);
    } finally {
      setLoading(false);
    }

  }, [selectedMunicipality, token]);

  const fetchFacturas_F = async () => {
    const startDateFormatted = startDate.toISOString().split("T")[0];
    const endDateFormatted = endDate.toISOString().split("T")[0];

    console.log("El tipo de factura: ", selectedTax,
      " la fecha inicial: ", (startDateFormatted),
      " la fecha final: ", (endDateFormatted));

    if (startDateFormatted > endDateFormatted) return toast.error("La fecha inicial no puede ser mayor a la fecha final");

    if (!selectedMunicipality) {
      toast.error("No se ha seleccionado una Municipalidad, no se cargara el historico de pagos.");
      setLoading(false);
      return;
    }
    setPaginaActual(1);
    setLoading(true);
    try {
      const respuesta: FacturasPagadas = await facturasPagadas_F(selectedMunicipality, selectedTax, startDateFormatted, endDateFormatted, selectedClaveCat, token);
      console.log("Esta es la respuesta de las facturas pagadas Filtradas: ", respuesta);

      if (respuesta && Array.isArray(respuesta)) {
        setHistorialFacturas(respuesta)
        // console.log("historial facturas: ", historialFacturas);
      }
    } catch (error) {
      console.log("Error obteniendo registros:", error);
    } finally {
      setLoading(false);
    }
    //En esta parte tendra que implementar la logica para refrescar las facturas
  };

  useEffect(() => {
    fetchHistorialPagos();
  }, []);//se cargan las facturas al inicio 

  return (
    <div className="historialFacturas">{/**tenemos la primera parte en donde se muestra la clase principal*/}
      <h2 className="title">HISTORICO DE PAGOS</h2>{/**El titulo que se muestra en la parte de facturacion*/}

      {/* Date Range Filter */}
      <div className="historial-facturacion-container">{/**En este apartado tenemos el contenedor de los  bloques de los filtros de busqueda y por fechas*/}

        <div className="date-range-container">
          <div className="date-range-label">
            <label htmlFor="tipoFactura">Tipo de factura</label>
            <label htmlFor="date-inicio">Fecha Inicial</label>
            <label htmlFor="date-final">Fecha Final</label>
          </div>

          <div className="date-range-filter">
            <select id="tipoFactura" className="selectInvoice" onChange={handleTaxChange}>{/**Select, es un etiqueta en donde podemos seleccionar las opciones que nos ofrecen*/}
              {facturasOptions.map(opt => (
                <option key={opt.value} value={opt.value} style={{ background: "#FFFFFF", color: "black" }}>
                  {opt.label}
                </option>
              ))}
            </select>

            <input id="date-inicio"
              type="date"
              className="date-inicio"
              value={startDate.toISOString().split('T')[0]}
              onChange={(e) => {
                setStartDate(new Date(e.target.value)); // se convierte el input string a Date
              }} />{/**En esta parte tenemos un input en donde pasamos la parte de fecha */}

            <input id="date-final"
              type="date"
              className="date-final"
              value={endDate.toISOString().split('T')[0]}
              onChange={(e) => {
                setEndDate(new Date(e.target.value));
              }} />{/**En esta parte tambien tenemos un input con el type de fecha*/}

            <button className="buttonSearch" title="Buscar Facturas"
              onClick={selectedTax === 'ALL' ? fetchHistorialPagos : fetchFacturas_F}>
              <FaSearch /></button>{/**Este boton nos ayuda poder refrescar la factuaras actuales*/}

          </div>

          <div className="date-range-label">
            {selectedTax === 'BI' && (
              <label htmlFor="selClaveCat" style={{ marginTop: '5px' }}>Clave Catastral</label>)}
          </div>

          <div className="date-range-filter">
            {selectedTax === 'BI' && (
              <select id="selClaveCat" style={{ width: "200px" }} className="selectInvoice"
                onChange={((e) => setSelectedClaveCat(e.target.value))}>
                {clavesCat.map(clave => (
                  <option key={clave} value={clave}>
                    {clave}
                  </option>
                ))}
              </select>
            )}
          </div>


        </div>
      </div>

      <div >
        <table className="details-table table table-hover table-sm align-middle w-100">{/**En este caso tenemos las tablas que se le mostrarar en la parte del diseño al usuario*/}
          <thead>
            <tr>
              <th>N° FACTURA</th>
              <th>FECHA DE VENCIMIENTO</th>
              <th>CLAVE CATASTRAL </th>
              <th>DESCRIPCION</th>
              <th>VALOR FACTURADO</th>
              <th>VALOR PAGADO</th>
              <th>FECHA DE PAGO</th>
              <th>VER RECIBO</th>
            </tr>
          </thead>

          <tbody>
            {loading
              // Mientras carga, dibuja  registrosPorPagina filas de skeleton con 11 celdas cada una
              ? Array.from({ length: registrosPorPagina }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 8 }).map((__, j) => (
                    <td key={j} style={{ textAlign: "center" }}>
                      <Skeleton height={20} />
                    </td>
                  ))}
                </tr>
              ))

              : registrosActuales.map((registro, i) => (
                <tr key={i} className="table-hovers">
                  <td>{registro.NoFactura}</td>
                  <td>{registro.FechaVence}</td>
                  <td>{registro.ClaveCatastral || "NO APLICA"}</td>
                  <td>{registro.Descripcion}</td>
                  <td>L. {registro.ValorFacturado}</td>
                  <td>L. {registro.ValorPagado}</td>
                  <td>{registro.FechaPago}</td>
                  <td >
                    <button className="btnRecibos" title="Visualizar recibo" onClick={() => { navigate("/recibo-BI") }}>
                      <FaEye /> &nbsp; {registro.NoRecibo}
                    </button>
                  </td>

                </tr>
              ))}

            {!loading && historialFacturas.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center" }}>
                  NO SE ENCONTRARON FACTURAS
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {historialFacturas.length > registrosPorPagina && !loading && (
          <PaginationControl
            page={paginaActual}
            total={historialFacturas.length}
            between={2}
            changePage={(page: number) => handleCambioPag(page)}
            limit={registrosPorPagina}
          />

        )}

      </div>
    </div >
  );
};

export default HistorialPagos;