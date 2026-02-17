// src/components/DetallesImpuesto.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "../../style/ImpuestosStyles/detalleBienInmueble.css";
import { clavesCatastrales } from "../../services/claveCatastral";
import { useAuth } from "../../Auth/AuthContext";
import { mensajes } from "../../util/message";
import { PaginationControl } from 'react-bootstrap-pagination-control';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { biHeaders } from "../../util/headerDescrip";
import{TableBase} from "../shared/tableComponent/tableGenerica";


interface Claves {
  prop: string;
  claveCat: string;
  valorImp: string;
  uso: string;
  subUso: string;
  aldea: string;
  barrio: string;
  direccion: string;
  dni: string
}


const DetallesImpuesto: React.FC = () => {
  const navigate = useNavigate();
  const { user, selectedMunicipality, token } = useAuth();

  const [claves, setClaves] = useState<Claves[]>([]); //<Claves[]> es el tipo y ([]) es lo que se inicializa en el mismo;
  const [loading, setLoading] = useState(true);
  const biTableHeaders = ['Propietario', 'Clave Catastral', 'Valor Impuesto', 'Uso', 'Sub Uso', 'Aldea', 'Barrio/Caserio', 'Dirección'] as const; //Tupla en vez de arreglo
  const renderTooltip = (displayedText: string, props?: any) => (
    <Tooltip className="tooltip-BI" {...props}>
      {displayedText}
    </Tooltip>
  );

  useEffect(() => {
    if (!selectedMunicipality || !token) return;

    const fetchClaves = async () => {
      setLoading(true);
      try {
        const respuesta = await clavesCatastrales(selectedMunicipality, token);
        // console.log(" respuesta API clavesCatastrales:", respuesta);

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
      } finally {
        setLoading(false);
      }
    };

    fetchClaves();
  }, [selectedMunicipality]);

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 5;
  const indUltimoReg = paginaActual * registrosPorPagina; //si estoy en la pagina 2 el indUltimoReg seria 10 ya que se utiliza 2*5=10, tambien se usa para lo que se mostrara en la tabla
  const indPrimerReg = indUltimoReg - registrosPorPagina; //si estoy en la pagina 2 el indPrimerReg seria 5 ya que se utiliza 10-5 = 5, tambien se usa para lo que se mostrara en la tabla
  const registrosActuales = claves.slice(indPrimerReg, indUltimoReg); //son los registros que se muestran en la pagina Actual es decir del 5 - 9 si estamos en la pag 2 , tambien se usa para lo que se mostrara en la tabla
  // console.log("La lontitug de claves: ", claves.length);
  const handleCambioPag = (numPag: number) => setPaginaActual(numPag);
  console.log("Datos para tabla de BI: ", claves);
console.log("Registros actuales para tabla de BI: ", registrosActuales);
  const handleVerFacturas = async (claveCat: string, direccion: string) => {

    if (!selectedMunicipality || !token) {
      toast.error("Debe iniciar sesión y seleccionar municipalidad.");
      return;
    }
    try {
      // const facturaResponse = await facturaBienesInmueble(
      //   selectedMunicipality,
      //   claveCat,
      //   token
      // );
      toast.success("Factura generada para proceso de pago.");
      navigate("/facturas-BI", {
        // state: { municipalidad: selectedMunicipality, claveCat, direccion, facturaData: facturaResponse }
        state: { municipalidad: selectedMunicipality, claveCat, direccion }
      });
    } catch {
      toast.error(mensajes["Error al obtener facturas para este bien inmueble"].mensaje);
    }
  };

  return (
    <div className="detalles-impuesto-container">
      
      <h2 className="title" style={{ textAlign: "center" }}>
        LISTADO DE BIENES INMUEBLES
      </h2>

      {/* <TableBase <Claves> loading={loading} data={registrosActuales} 
       
      columns={[
        {header: "Propietario", accessor: "prop"},
        {header: "Clave Catastral", accessor: "claveCat"},
        {header: "Valor Impuesto", accessor: "valorImp"},
        {header: "Uso", accessor: "uso"},
        {header: "Sub Uso", accessor: "subUso"},
        {header: "Aldea", accessor: "aldea"},
        {header: "Barrio/Caserio", accessor: "barrio"},
        {header: "Direccion", accessor: "direccion"},
        {
      header: "Ver Facturas",accessor: "acciones",
      render: (row: Claves) => (
        <button
          className="btnFacturas"
          onClick={() =>
            handleVerFacturas(row.claveCat, row.direccion)
          }
        >
          Facturas
        </button>
      ),
    },
      ]}
      
      /> */}

       <div className="table-responsives details-table table table-hover table-sm align-middle w-100">
        <table className="details-table table table-hover table-sm align-middle w-100">
          <thead className="table-light" >
            <tr >
              {biTableHeaders.map((item, idx) => (
                <th key={idx}>
                  {item}  &nbsp;
                  <OverlayTrigger
                    placement="top"
                    delay={{ show: 200, hide: 500 }} //show es lo que tarda en mostrarse y delay en ocultarse
                    overlay={renderTooltip(biHeaders[item]?.def)}>
                    <i className="bi bi-question-circle"></i>
                  </OverlayTrigger>
                </th>
              ))}
              <th>Ver Facturas </th>
            </tr>
          </thead>
          <tbody>
            {loading
              // Mientras carga, mostramos skeletons
              ? Array.from({ length: registrosPorPagina }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 9 }).map((__, j) => (
                    <td key={j} style={{ textAlign: "center" }}>
                      <Skeleton height={20} />
                    </td>
                  ))}
                </tr>
              ))
              // Una vez cargado, los datos reales
              : registrosActuales.map((item, i) => (
                <tr key={i} className="table-hovers">
                  <td style={{ textAlign: "center" }}>{item.prop}</td>
                  <td style={{ textAlign: "center" }}>{item.claveCat}</td>
                  <td style={{ textAlign: "center" }}>L{item.valorImp}</td>
                  <td style={{ textAlign: "center" }}>{item.uso}</td>
                  <td style={{ textAlign: "center" }}>{item.subUso}</td>
                  <td style={{ textAlign: "center" }}>{item.aldea}</td>
                  <td style={{ textAlign: "center" }}>{item.barrio}</td>
                  <td style={{ textAlign: "center" }}>{item.direccion}</td>
                  <td style={{ textAlign: "center" }}>
                    <button
                      className="btnFacturas"
                      onClick={() => handleVerFacturas(item.claveCat, item.direccion)}
                    >
                      Facturas
                    </button>
                  </td>
                </tr>
              ))}

            {!loading && claves.length === 0 && (
              <tr>
                <td colSpan={9} style={{ textAlign: "center" }}>
                  No hay datos que mostrar
                </td>
              </tr>
            )}
          </tbody>
        </table>

      </div> 

      {claves.length > registrosPorPagina && !loading && (

        <PaginationControl

          page={paginaActual}
          total={claves.length}
          between={2}
          changePage={(page: number) => handleCambioPag(page)}
          limit={registrosPorPagina}
        />

      )}

    </div>
  );
};

export default DetallesImpuesto;