import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";

import { clavesCatastrales } from "../../services/claveCatastral";
import { facturaBienesInmueble } from "../../services/facturasBI";
import { useAuth } from "../../Auth/AuthContex";

import "../../style/ImpuestosStyles/detalleBienInmueble.css";
import "../../style/PagesStyles/titulo_TablasStyle.css";
import { mensajes } from "../../util/message";

/* Interfaz de los datos que tu API retorna */
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

  // Estado para almacenar la lista de bienes inmuebles
  const [claves, setClaves] = useState<Claves[]>([]);

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 5;

  // Obtenemos la municipalidad seleccionada y el usuario 
  const { user, selectedMunicipality } = useAuth();

  useEffect(() => {
    const fetchClaves = async () => {
      // Si no hay municipalidad o token, no hacemos la petición
      if (!selectedMunicipality) return;
      if (!user?.token) {
        toast.error("No hay token. Por favor inicie sesión.");
        return;
      }
      try {
        // Llamamos al servicio enviando la municipalidad y el token
        const respuesta = await clavesCatastrales(selectedMunicipality, user.token);

        // Si la API retorna un "message" dentro del objeto, lo mostramos con toast
        if (respuesta && typeof respuesta === "object" && respuesta.message) {
          toast.success(respuesta.message);
        }
        // Si la respuesta es un arreglo, lo guardamos en el estado
        if (Array.isArray(respuesta)) {
          setClaves(respuesta);
        } 
      } catch (error: any) {
        toast.error(mensajes["Error al obtener facturas para este bien inmueble"].mensaje);
      }
      
    };

    fetchClaves();
  }, [selectedMunicipality, user]);

  // Cálculo de los índices para la paginación
  const indUltimoReg = paginaActual * registrosPorPagina;
  const indPrimerReg = indUltimoReg - registrosPorPagina;
  const registrosActuales = claves.slice(indPrimerReg, indUltimoReg);
  const pagsTotales = Math.ceil(claves.length / registrosPorPagina);
  const handleCambioPag = (numPag: number) => {
    setPaginaActual(numPag);
  };

  // Función para enviar parámetros a la API de facturación y navegar a la siguiente pantalla
  const handleVerFacturas = async (claveCat: string, direccion: string) => {
    if (!selectedMunicipality) {
      toast.error("Debe seleccionar una municipalidad para continuar.");
      return;
    }
    if (!user?.token) {
      toast.error("No hay token. Por favor, inicie sesión nuevamente.");
      return;
    }
    try {
      // municipalidad, clave catastral y el token
      const facturaResponse = await facturaBienesInmueble(selectedMunicipality, claveCat, user.token);
      toast.success("Factura generada para proceso de pago");
      navigate("/facturas-BI", {// Navegacion a la siguiente pantalla 
        state: { 
          municipalidad: selectedMunicipality,claveCat,direccion,facturaData: facturaResponse 
        } 
      });
    } catch (error: any) {
       toast.error(mensajes["Error al obtener facturas para este bien inmueble"].mensaje);
    }
  };

  return (
    <div className="detalles-impuesto-container" >
      <Toaster richColors position="top-right" />
      <h2 className="title" style={{textAlign:"center"}}>LISTADO DE BIENES INMUEBLES</h2>

      <table className="details-table">
        <thead>
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
          {registrosActuales.map((item, index) => (
            <tr key={index}>
              <td style={{textAlign:"center"}}>{item.prop}</td>
              <td style={{textAlign:"center"}}>{item.claveCat}</td>
              <td style={{textAlign:"center"}}>L{item.valorImp}</td>
              <td style={{textAlign:"center"}}>{item.uso}</td>
              <td style={{textAlign:"center"}}>{item.subUso}</td>
              <td style={{textAlign:"center"}}>{item.aldea}</td>
              <td style={{textAlign:"center"}}>{item.barrio}</td>
              <td style={{textAlign:"center"}}>{item.direccion}</td>
              <td>
                <button className="btnFacturas" onClick={() => handleVerFacturas(item.claveCat, item.direccion)}>
                  Facturas
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {pagsTotales > 1 && (
        <div className="pagination">
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
