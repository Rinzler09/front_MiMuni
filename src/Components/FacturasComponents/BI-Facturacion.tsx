import React, { useState, useEffect, useMemo, Children } from "react";
import { useLocation } from "react-router-dom";
import "../../style/FacturasStyles/facturasBI.css";
import "../../style/ModalesStyles/TarjetasModal/modalAddTarjeta.css";
import "../../style/PagesStyles/titulo_TablasStyle.css";

import { facturaBienesInmueble } from "../../services/facturasBI";
import { useAuth } from "../../Auth/AuthContext";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "sonner";
import {Button} from "../shared/button/Button"
import { ButtonSize } from "../shared/button";
import ReportBI from "../PDF_Components/PDF_Impuestos/reporteBI";
import CardForm from '../shared/formComponent/formTarjetas';

//Importaciones de modelos de tarjeta
import visaImagen from "../../assets/iconoVisa.png";
import mastercardImagen from "../../assets/master.png";
import americaExpressImagen from "../../assets/america.png";
import ModalsConteiners from "../ModalComponents/ModalsConteiners";
import Advertencia from "../ModalComponents/modalsGenerales";
import {TableBase} from "../shared/tableComponent/tableGenerica"

interface Facturas {
  numFactura: number;
  fechaVence: string;
  descripcion: string;
  subtotal: number;
  descPP: number;
  descADM: number;
  descAMN: number;
  ajuste: number;
  valorPagado: number;
  total: number;
}

//Interfaz recibie informacion de Bienes Inmuebles
interface LocationState {
  claveCat: string;
  direccion: string;
  dni: string;
}

interface Comision{
  
}

const ProceosFacturacion: React.FC = () => {
  /*Se incializan los hook States de los parametros para la factura*/
  const [modalDetPago, setModalDetPago] = useState(false);
  const [pagoExitoso, setPagoExitoso] = useState(false);
  const closeModalDetPago = () => {
    setModalDetPago(false);
  };
  const { state } = useLocation() as { state: LocationState };
  const { claveCat, direccion } = state;
  const [loading, setLoading] = useState(true);
  const registrosPorPagina = 5;
  const closeCheckboxModal = () => setShowCheckboxModal(false);
  const closeCardRequiredModal = () => setShowCardRequiredModal(false);
  const openCardModal = () => setShowCardModal(true);
  const closeCardModal = () => setShowCardModal(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showConfirmationIcon, setShowConfirmationIcon] = useState(false);
  const [showOkButton, setShowOkButton] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("Procesando...");
  //Procesos de las modales de tarjetas
  const [showModals, setShowModals] = useState<boolean>(false);
  const [showCheckboxModal, setShowCheckboxModal] = useState<boolean>(false);
  const [showCardRequiredModal, setShowCardRequiredModal] = useState<boolean>(false);
     console.log("Mostrar modal de checboks", showCheckboxModal);
  // Estados para los datos de la tarjeta
  console.log("Mostrar modal de tarjetas", showModals);

  const [savedCard, setSavedCard] = useState<{
    number: string;
    name: string;
    expiry: string;
    direccion: string;
    type: string;
  } | null>(null);


  //Escoger del logo
const logos:Record<string, string> = {
  visa: visaImagen,
  mastercard: mastercardImagen,
  americanexpress: americaExpressImagen,
};

//Funcion para poder obtener el logo de la tarjeta
const getCardLogo = (type: string): string | undefined=> {
  if (!type) return undefined;

   const normalized = type.replace(/\s+/g, "").toLowerCase();
   return logos[normalized];
}

  //Probar la logica de guardar e este el componente
  const handleCardSaved = (card: any) =>{
    setSavedCard(card);
  }

  /*HOOKS PARA PAGOS A DB GEOREDES*/
  const [facturas, setFacturas] = useState<Facturas[]>([]);
  const [paginaActual, setPaginaActual] = useState(1);

  // Cálculo de los índices para la paginación
  const indUltimoReg = paginaActual * registrosPorPagina;
  const indPrimerReg = indUltimoReg - registrosPorPagina;
  const facturasActuales = facturas.slice(indPrimerReg, indUltimoReg); //Este es el codigo donde se hace la facilita, y lo vamos utilizar para el movimiento.
  const pagsTotales = Math.ceil(facturas.length / registrosPorPagina);
  const handleCambioPag = (numPag: number) => setPaginaActual(numPag);
  const { user, selectedMunicipality, token } = useAuth();
  // Declaramos la clave catastral en el estado o la recibimos de alguna parte
  //const [claveCat, setClaveCat] = useState("CU238"); // ejemplo
  useEffect(() => {
    const fetchFacturas = async () => {
      setLoading(true);

      if (!selectedMunicipality) {
        setLoading(false);
        return;
      }

      try {
        if (!selectedMunicipality) {
          toast.error( "No se ha seleccionado una Municipalidad, no cargara registros de facturas.");
          return;
        }

        const respuesta = await facturaBienesInmueble(
          selectedMunicipality, claveCat, token
        );

        if (respuesta && Array.isArray(respuesta)) {
          setFacturas(respuesta);
        } else {
          console.error(
            "La respuesta de la API no contiene un arreglo:",
            respuesta
          );
        }
      } catch (error) {
        console.log("Error obteniendo registros:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFacturas();
  }, [claveCat, selectedMunicipality, user]);

  //Cuando se clickea el boton pagar se ejecuta el metodo handlePayButtonClick
  //el cual mediante fetch usa un post para enviar el json conteniendo la estrucutar del pago de factura
const handlePayButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault(); // siempre primero para evitar submit
   console.log("SelectItems antes de pagar:", selectItems);
        // Validación: tarjeta
        if (!savedCard) {
          setShowCardRequiredModal(true); // abrir modal de agregar tarjeta
          return; // salir
        }
        // Validación: selección de facturas
        if (selectItems.length === 0) {
          setShowCheckboxModal(true); // abrir modal de advertencia de checkbox
          return; // salir
        }
        // Si pasa todo, abrir modal de detalle de pago
        setModalDetPago(true);
        //setShowConfirmationModal(true);
};


  //Implementacion para la seleccion de checkbox en la facturas
  const [selectItems, setSelectedItems] = useState<number[]>([]);

  //Se realiza el calculo del total de las facturas seleccionadas
  const seleccionCantidad = React.useMemo(() => {
    const selected = new Set(selectItems.map(String)); //Convertimos todos los ID seleccionado a string

    return facturas.reduce((cantidad, cantidadFacturas) => {
      return selected.has(String(cantidadFacturas.numFactura))
        ? cantidad + cantidadFacturas.total
        : cantidad;
    }, 0);
  }, [selectItems, facturas]);

  //Funcion para formatear el numero de tarjeta en la mini tarjeta
  const formatCardNumber = (num: string) => {
    return num.replace(/(.{4})/g, '$1 ').trim();
  }



  //Codigo de implementaco
  const seleccionFilas = (item: Facturas) => {
    const id = item.numFactura;
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Seleccionar/deseleccionar TODO el dataset (todas las páginas)
  const seleccionGlobalmente = (checked: boolean) => {
    setSelectedItems(checked ? idsGlobal : []);
  };

  //Codigo para seleccionar todas las facturas
  const idsGlobal = useMemo(
    () => facturas.map((f) => f.numFactura),
    [facturas]
  );
  //Logica para poder seleecionar las 5 facturas actuales y no seleccionar el checkbox de todas las facturas
  const pageAllSelected = useMemo(
    () =>
      facturas.length > 0 &&
      facturas.every((f) => selectItems.includes(f.numFactura)),
    [facturas, selectItems]
  );
  const [headerClicked, setHeaderClicked] = useState(false);

  useEffect(() => {
    if (!pageAllSelected && headerClicked) setHeaderClicked(false);
  }, [pageAllSelected, headerClicked]);

  console.log("Lo que viene de la modal de tarjeta de pago", savedCard);

  return (
    <div className="detalles-impuesto-container-facturacion">
      <div className="title" style={{ textAlign: "center" }}>
        {" "}
        ESTADO DE CUENTA BIENES INMUEBLES
      </div>
     <div className="subsTitles" style={{textAlign: "center"}}>Datos del Inmueble</div>
      <br/>
      {/* En este es el apartado es de la tabla en donde se muestra los datos del usuario */}
      <TableBase  <LocationState> loading={loading} data={[{ claveCat, dni: "0801-2001-03973", direccion }]}
       columns={[
        { header: "Clave Catastral", accessor: "claveCat" },
        { header: "DNI", accessor: "dni" },
        { header: "Dirección", accessor: "direccion" },]} />
       <br/> <br/> <br /> 

        {/* Datos de las Tablas de facturacion*/}
       <TableBase <Facturas> loading={loading} data={facturasActuales} showCheckbox={true} selectedRows={selectItems} 
       onSelectRow={seleccionFilas} onSelectAll={seleccionGlobalmente } allSelected={pageAllSelected} getRowId={(row) => row.numFactura}
        columns={[
        { header: "N° Factura", accessor: "numFactura" },
        { header: "Fecha Vence", accessor: "fechaVence" },
        { header: "Descripción", accessor: "descripcion" },
        { header: "Subtotal", accessor: "subtotal" },
        { header: "Desc. P.P", accessor: "descPP" },
        { header: "Desc. ADM", accessor: "descADM" },
        { header: "Desc. AMN", accessor: "descAMN" },
        { header: "Ajuste", accessor: "ajuste" },
        { header: "Valor Pagado", accessor: "valorPagado" },
        { header: "Total", accessor: "total"}
        ]}/>

      {pagsTotales > 1 &&
        !loading && ( //me quede por aqui
          <div className="pagination">
            {Array.from({ length: pagsTotales }, (_, i) => (
              <button key={i + 1} onClick={() => handleCambioPag(i + 1)}>
                {i + 1}
              </button>
            ))}
          </div>
        )}

      {/* Sección de Mis tarjetas */}

      <div className="credit-card-section ">
        {""}
        <h3>Mis tarjetas de credito y debito</h3>
        <div className="card-display-container">
          {savedCard ? (
          <div className="mini-card">
           <div className={`mini-card-bg ${savedCard?.type?.toLowerCase() || ""}-bg`}>
            {getCardLogo(savedCard.type) &&(
              <img src={getCardLogo(savedCard.type)} className="mini-card-logo" alt="" />)}
              <p className="mini-card-number">{formatCardNumber(savedCard.number)}</p>
              <p className="mini-card-name">{savedCard.name}</p>
              <p className="saved-card-expiry">Válida hasta {savedCard.expiry}</p>
            </div>
            <div className="butto-card">
              <Button size={ButtonSize.SMALL} disabled={false} color="#d3d3d3ff"
                  label="Editar" onClick={() =>  setShowModals(true)}/>
            </div>
            </div>
          ) : (
            <button className="add-card-link" onClick={() => setShowModals(true)}>Agregar una tarjeta</button>
          )}
          <p className="card-info">Aceptamos las principales tarjetas</p>
            {/* <TarjetasPagos showCardModal={showCardModal} closeCardModal={closeCardModal} onSaveCard={handleCardSaved}/>  */}
          {/* <ModalsConteiners showModals={showModals} /> */}
         <ModalsConteiners open={showModals} onClose={() => setShowModals(false)}>
           <div style={{ padding: '20px', color: 'black' }}>
           <CardForm onSave={handleCardSaved} onCancel={() => setShowModals(false)} initialData={savedCard ?? undefined} />
           </div>
         </ModalsConteiners>
        </div>
      </div>

      {/* Total y botones */}
      <div className="payment-summary details-table table table-hover table-sm align-middle w-120">
        <p>Total a Pagar: LPS {seleccionCantidad.toLocaleString()}</p>
        <button className="button-cancel">Cancelar</button>
        {/* <Link to="/Proceso-Tarjeta"  className="button-links" onClick={handlePayButtonClick}> Pagar </Link> */}
        <button className="button-links" onClick={handlePayButtonClick }>Pagar</button>
      </div>

      {/* Modal de advertencia de selección de checkbox */}
      {/*Cambiar la logica a un componente reutilizable 12/01/2025*/}
        <ModalsConteiners open={showCheckboxModal} onClose={() => setShowCheckboxModal(false)}> 
         <div style={{ padding: '20px', color: 'black' }}>
          <Advertencia  icono={"img/error.svg"} 
            titulo={"MENSAJE DE ADVERTENCIA"} 
            mensaje={"Debe seleccionar al menos un periodo de deuda para continuar con el pagos"}
            onConfirmar={closeCheckboxModal} textoBoton="Listo"> 
         </Advertencia> 
         </div>
        </ModalsConteiners>
    
      {/* Modal de advertencia para agregar tarjeta de crédito */}
      <ModalsConteiners open={showCardRequiredModal} onClose={() => setShowCardRequiredModal(false)}>
        <div style={{padding: '20px', color: 'black'}}>
          <Advertencia  icono={"img/error.svg"} 
            titulo={"MENSAJE DE ADVERTENCIA"} 
            mensaje={"Debes agregar una tarjeta de crédito o débito antes de proceder con el pago."}
            onConfirmar={closeCardRequiredModal} textoBoton="Listo"> 
          </Advertencia>
        </div>
      </ModalsConteiners>
    
      {/* Modal de confirmación */}
      <ModalsConteiners open={showConfirmationModal} onClose={() => setShowConfirmationModal(false)}>
        <div style={{padding: '20px', color: 'black'}}>
          <Advertencia icono={showConfirmationIcon ? "img/procesado.svg" : ""}
            titulo={"MENSAJE DE CONFIRMACIÓN"}
            mensaje={confirmationMessage}
            onConfirmar={() => {setShowConfirmationModal(false);}} textoBoton="Listo">
          </Advertencia>
        </div>
      </ModalsConteiners>


      {/* Modal desglose de cobro durante transaccion (donde se cobran los 30 lps)*/}
      {/* <ModalsConteiners  open={modalDetPago} onClose={() => setModalDetPago(false)}>
        <div style={{padding: '2opx', color: 'black'}}>
          <Advertencia icono= {"img/alert.svg"}
           titulo={"Detalle de transacción"}
           mensaje={"Aqui podra visualizar un desglose de cada cargo que pase aplicara a su tarjeta."}
           onConfirmar={() => {setShowConfirmationModal(false);}} textoBoton="Acepto" >
           <TableBase   variant="summary"
              loading={false}
              data={[
                { label: "Subtotal", value: `LPS ${seleccionCantidad.toLocaleString()}` },
                { label: "Comisión por Servicio Web", value: "LPS 30.00" },
                { label: "Valor Neto", value: `LPS ${(seleccionCantidad + 30).toLocaleString()}` },
              ]}
              columns={[
                { header: "DESCRIPCIÓN", accessor: "label" },
                { header: "VALOR", accessor: "value" },
              ]}/>

             
          </Advertencia>
        </div>
      </ModalsConteiners> */}


      {/*Cambiar la logica a un componente reutilizable*/}
       {modalDetPago && (
        <div className="modal-overlay ">
          <div className="modalPago">
            <h3 className="modal-title" style={{ textAlign: "center" }}>
              <img
                src="img/alert.svg"
                alt="alertaPago"
                className="modal-icon"
              />{" "}
              &nbsp; Detalle de transaccion
            </h3>

            <p className="modal-message">
              Aqui podra visualizar un desglose de cada cargo que pase aplicara a
              su tarjeta.
            </p>

            <table className="details-table">
              <thead>
                <tr>
                  <th>DESCRIPCION</th>
                  <th>VALOR</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>Subtotal</strong>
                  </td>
                  <td>5,528.00 LPS.</td>
                </tr>
                <tr>
                  <td>
                    <strong>Comisión por Servicio Web</strong>
                  </td>
                  <td>30.00 LPS.</td>
                </tr>
                <tr>
                  <td>
                    <strong>Valor Neto</strong>
                  </td>
                  <td>5,558.00 LPS.</td>
                </tr>
              </tbody>
            </table>
            <br />

            <p className="modal-message">
              Estimado contribuyente, al continuar, acepta que los cobros
              desglosados a continuación son el resultado de el uso de la
              plataforma web y los impuestos municipales.
              <br />
              <br />
              <strong>
                Por favor, revise cuidadosamente los detalles antes de
                proceder."
              </strong>
            </p>

            <div className="pagoBotones">
              <button onClick={() => {setShowConfirmationModal(true); setModalDetPago(false);
                  //hacerCobro();
                }}
                className="modal-button">
                ACEPTO
              </button>
              <button
                onClick={() => {closeModalDetPago();}}
                className="modal-button">
                RECHAZO
              </button>
            </div>
          </div>
        </div>
      )}       
      
    </div>
  );
};

export default ProceosFacturacion;
