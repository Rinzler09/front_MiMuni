// Posible error solucionado, de dublica de informacion
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";

import { clavesCatastrales } from "../../services/claveCatastral";
import { facturaBienesInmueble } from "../../services/facturasBI";
import { useAuth } from "../../Auth/AuthContex";

import "../../style/ImpuestosStyles/detalleBienInmueble.css";
import "../../style/PagesStyles/titulo_TablasStyle.css";
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
  const [claves, setClaves] = useState<Claves[]>([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 5;

  const { user, selectedMunicipality } = useAuth();
  const token = user?.token;

  useEffect(() => {
    if (!selectedMunicipality || !token) return;

    const fetchClaves = async () => {
      try {
        const respuesta = await clavesCatastrales(selectedMunicipality, token);
        console.log(" respuesta API clavesCatastrales:", respuesta);

        // 1) Extraemos array: puede venir directamente o en respuesta.data
        const rawArray = Array.isArray(respuesta)
          ? respuesta
          : Array.isArray((respuesta as any).data)
            ? (respuesta as any).data
            : null;

        if (!rawArray) {
          console.error("La API no devolvió un array:", respuesta);
          toast.error("La API no devolvió datos de inmuebles.");
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
      }
    };

    fetchClaves();
  }, [selectedMunicipality, token]);

  // Paginación
  const indUltimoReg = paginaActual * registrosPorPagina;
  const indPrimerReg = indUltimoReg - registrosPorPagina;
  const registrosActuales = claves.slice(indPrimerReg, indUltimoReg);
  const pagsTotales = Math.ceil(claves.length / registrosPorPagina);

  const handleCambioPag = (numPag: number) => setPaginaActual(numPag);

  const handleVerFacturas = async (claveCat: string, direccion: string) => {
    if (!selectedMunicipality || !token) {
      toast.error("Debe iniciar sesión y seleccionar municipalidad.");
      return;
    }
    try {
      const facturaResponse = await facturaBienesInmueble(selectedMunicipality, claveCat, token);
      toast.success("Factura generada para proceso de pago");
      navigate("/facturas-BI", {
        state: { municipalidad: selectedMunicipality, claveCat, direccion, facturaData: facturaResponse }
      });
    } catch {
      toast.error(mensajes["Error al obtener facturas para este bien inmueble"].mensaje);
    }
  };

  return (
    <div className="detalles-impuesto-container">
      <Toaster richColors position="top-right" />
      <h2 className="title" style={{ textAlign: "center" }}>LISTADO DE BIENES INMUEBLES</h2>

      <table className="details-table">
        <thead>
          <tr>
            <th>Propietario</th><th>Clave Catastral</th><th>Valor Impuesto</th>
            <th>Uso</th><th>Sub Uso</th><th>Aldea</th><th>Barrio/Caserio</th>
            <th>Dirección</th><th>Ver Facturas</th>
          </tr>
        </thead>
        <tbody>
          {registrosActuales.map((item, i) => (
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
                  onClick={() => handleVerFacturas(item.claveCat, item.direccion)}
                >
                  Facturas
                </button>
              </td>
            </tr>
          ))}
          {claves.length === 0 && (
            <tr>
              <td colSpan={9} style={{ textAlign: "center" }}>No hay datos que mostrar</td>
            </tr>
          )}
        </tbody>
      </table>

      {pagsTotales > 1 && (
        <div className="pagination">
          {Array.from({ length: pagsTotales }, (_, i) => (
            <button key={i+1} onClick={() => handleCambioPag(i+1)}>
              {i+1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DetallesImpuesto;
