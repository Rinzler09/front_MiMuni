import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../style/FacturasStyles/facturasBI.css";
import "../../style/ModalesStyles/TarjetasModal/modalAddTarjeta.css";
import "../../style/PagesStyles/titulo_TablasStyle.css"
import { PaginationControl } from 'react-bootstrap-pagination-control';
import { facturaBienesInmueble } from "../../services/facturasBI";
import { useAuth } from "../../Auth/AuthContext";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "sonner";
import Spinner from 'react-bootstrap/Spinner';
import ReportBI from "../PDF_Components/PDF_Impuestos/reporteBI";
import { FaEye } from "react-icons/fa";
import visaImagen from "../../assets/iconoVisa.png";
import mastercardImagen from "../../assets/master.png";
import americaExpressImagen from "../../assets/america.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import Modal from "../shared/ModalComponents/modalComponent";
import ModalsConteiners from "../shared/ModalComponents/ModalsConteiners";
import CardForm from "../shared/TarjetasComponents/formTarjetas";

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

const ProceosFacturacion: React.FC = () => {

  /*Se incializan los hook States de los parametros para la factura*/
  const [modalDetPago, setModalDetPago] = useState(false);
  const [modalProPay, setModalProPay] = useState(false);
  const [pagoExitoso, setPagoExitoso] = useState(false);
  // const [viewPDF, setViewPDF] = useState<boolean>(false);

  const closeModalDetPago = () => {
    setModalDetPago(false);
  };

  const { state } = useLocation() as { state: LocationState };
  const { claveCat, direccion } = (state ?? {});

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const registrosPorPagina = 5;


  const [showModals, setShowModals] = useState<boolean>(false);
  // const [selectedAmount, setSelectedAmount] = useState(0);
  // const [selectedYears, setSelectedYears] = useState<number[]>([]);
  // const [showModal, setShowModal] = useState(false);
  const [showCheckboxModal, setShowCheckboxModal] = useState(false);
  // const [showCardModal, setShowCardModal] = useState(false);
  const [showCardRequiredModal, setShowCardRequiredModal] = useState(false);
  // const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  // const [showConfirmationIcon, setShowConfirmationIcon] = useState(false);
  // const [showOkButton, setShowOkButton] = useState(false);
  // const [confirmationMessage, setConfirmationMessage] =
  //   useState("Procesando...");
  // Estados para los datos de la tarjeta
  // const [cardNumber, setCardNumber] = useState("•••• •••• •••• ••••");
  // const [cardName, setCardName] = useState("SU NOMBRE AQUÍ");
  // const [cardExpiry, setCardExpiry] = useState("MM / YY");
  // const [cardCVV, setCardCVV] = useState("");
  // const [isBackView, setIsBackView] = useState(false);
  const [savedCard, setSavedCard] = useState<{
    number: string;
    name: string;
    expiry: string;
    direccion: string;
    type: string;
  } | null>(null);

  const logos: Record<string, string> = {
    visa: visaImagen,
    mastercard: mastercardImagen,
    amex: americaExpressImagen,
  };

  const getCardLogo = (type: string): string | undefined => {
    if (!type) return undefined;

    const normalized = type.replace(/\s+/g, "").toLowerCase();
    return logos[normalized];
  }

  const handleCardSaved = (card: any) => {
    setSavedCard(card);
  }


  /*HOOKS PARA PAGOS A DB GEOREDES*/
  const [facturas, setFacturas] = useState<Facturas[]>([]);

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);


  // Cálculo de los índices para la paginación

  const indUltimoReg = paginaActual * registrosPorPagina;
  const indPrimerReg = indUltimoReg - registrosPorPagina;
  const facturasActuales = facturas.slice(indPrimerReg, indUltimoReg);
  const handleCambioPag = (numPag: number) => setPaginaActual(numPag);


  const { user, selectedMunicipality, token, identifier } = useAuth();

  const dniDigits = identifier?.replace(/\D/g, '');//para mantener solo los digitos del DNI
  const dniParts = [dniDigits?.slice(0, 4), dniDigits?.slice(4, 8), dniDigits?.slice(8, 13)].filter(Boolean); // Cuts the digits into three groups, filter(Boolean) removes empty parts so you don’t get trailing dashes.
  const formattedDni = dniParts.join('-');// Joins only the existing parts with hyphens.

  // 2) Declaramos la clave catastral en el estado o la recibimos de alguna parte
  //const [claveCat, setClaveCat] = useState("CU238"); // ejemplo

  useEffect(() => {
    const fetchFacturas = async () => {

      if (!claveCat) {
        toast.error("Debe seleccionar un Bien Inmueble para ver sus facturas.",);
        navigate("/error-404"); //si no existe una clave catastral seleccionada entonces navega a facturas-bi
      }

      setLoading(true);

      if (!selectedMunicipality) {
        setLoading(false);
        return;
      }

      try {

        if (!selectedMunicipality) {
          toast.error("No se ha seleccionado una Municipalidad, no cargara registros de facturas.");
          return;
        }

        const respuesta = await facturaBienesInmueble(selectedMunicipality, claveCat, token);

        if (respuesta && Array.isArray(respuesta)) {
          setFacturas(respuesta);
        } else {
          console.error("La respuesta de la API no contiene un arreglo:", respuesta);
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
  const handlePayButtonClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    if (!savedCard) {
      setShowCardRequiredModal(true);
      return;
    }

    if (selectItems.length === 0) {
      setShowCheckboxModal(true);
      return;
    }

    setModalDetPago(true);

  };

  //Implementacion para la seleccion de checkbox en la facturas
  const [selectItems, setSelectedItems] = useState<number[]>([]);

  //Se realiza el calculo total de las facturas selecionadas
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
    // return num.replace(/(.{4})/g, '$1 ').trim();
    const clean = num.replace(/\s/g, "");// Elimina los espacios del número de tarjeta para trabajar con una cadena limpia
    return clean.replace(/(.{4})/g, '$1 ').trim();
  }

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


  const processPayment = () => {
    setModalProPay(true);
    setTimeout(() => {
      setPagoExitoso(true);
      setModalProPay(false);
    }, 2000)
  }

  // const closeModal = () => setShowModal(false);
  // const closeCheckboxModal = () => setShowCheckboxModal(false);
  // const closeCardRequiredModal = () => setShowCardRequiredModal(false);
  // const openCardModal = () => setShowCardModal(true);
  // const closeCardModal = () => setShowCardModal(false);

  // const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const rawValue = e.target.value.replace(/\s+/g, "");
  //   const formattedValue = rawValue.replace(/(\d{4})(?=\d)/g, "$1 ");
  //   setCardNumber(formattedValue || "•••• •••• •••• ••••");
  // };

  // const handleCardNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setCardName(e.target.value || "SU NOMBRE AQUÍ");
  // };

  // const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setCardExpiry(e.target.value || "MM / YY");
  // };

  // const handleCardCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setCardCVV(e.target.value);
  // };

  // const handleSaveCard = () => {
  //   setSavedCard({
  //     number: cardNumber,
  //     name: cardName,
  //     expiry: cardExpiry,
  //   });
  //   closeCardModal();
  // };


  return (
    <div className="detalles-impuesto-container">

      <div className="title" style={{ textAlign: "center" }}> ESTADO DE CUENTA BIENES INMUEBLES</div>

      <h2 className="subTitles">Datos del Inmueble</h2>

      {/* Datos de las Tablas Superior*/}
      <table className="details-table">
        <thead>
          <tr>
            <th>Clave Catastral</th>
            <th>DNI</th>
            <th>Dirección</th>
          </tr>
        </thead>
        <tbody>

          {loading ? Array.from({ length: Math.max(facturas.length, 1) }).map((_, i) => (//Tenemos un arrelgo donde tiene el maximo de facturas 
            <tr key={i}>
              {Array.from({ length: 3 }).map((__, j) => (
                <td key={j} style={{ textAlign: "center" }}>
                  <Skeleton height={20} />
                </td>
              ))}
            </tr>
          ))
            : (
              <tr>
                <td style={{ textAlign: "center" }}>{claveCat || "No encontrado"}</td>
                <td style={{ textAlign: "center" }}>{formattedDni || "No encontrado"}</td>
                <td style={{ textAlign: "center" }}>{direccion || "No encontrado"}</td>
              </tr>
            )
          }

        </tbody>
      </table>

      <br />
      <br />

      {/* Datos de las Tablas Inferior*/}
      <table className="details-table table table-hover table-sm align-middle w-100">
        <thead className="table-light">
          <tr>
            <th>
              <input
                type="checkbox"
                checked={pageAllSelected || headerClicked}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setHeaderClicked(checked);
                  seleccionGlobalmente(checked);
                }}
                aria-checked={
                  pageAllSelected || headerClicked
                    ? "true"
                    : selectItems.length
                      ? "mixed"
                      : "false"
                } />
            </th>
            <th>N° Factura</th>
            <th>Fecha Vence</th>
            <th>Descripción</th>
            <th>Subtotal</th>
            <th>Desc. P.P</th>
            <th>Desc. ADM</th>
            <th>Desc. AMN</th>
            <th>Ajuste</th>
            <th>Valor Pagado</th>
            <th>Total</th>
          </tr>
        </thead>

        <tbody>
          {/* se mapea el arreglo facturas y luego se desglosa cada factura */}
          {loading
            // Mientras carga, dibuja  registrosPorPagina filas de skeleton con 11 celdas cada una
            ? Array.from({ length: registrosPorPagina }).map((_, i) => (
              <tr key={i}>
                {Array.from({ length: 11 }).map((__, j) => (
                  <td key={j} style={{ textAlign: "center" }}>
                    <Skeleton height={20} />
                  </td>
                ))}
              </tr>
            ))

            // Cuando ya cargó, mapea las facturas
            : facturasActuales.map((item) => (
              <tr key={item.numFactura} className="table-hovers">
                <td style={{ textAlign: "center" }}>
                  <input
                    type="checkbox"
                    checked={selectItems.includes(item.numFactura)}
                    onChange={() => seleccionFilas(item)}
                  />
                </td>
                <td style={{ textAlign: "center" }}>{item.numFactura}</td>
                <td style={{ textAlign: "center" }}>{item.fechaVence}</td>
                <td style={{ textAlign: "center" }}>{item.descripcion}</td>
                <td style={{ textAlign: "center" }}>L{item.subtotal}</td>
                <td style={{ textAlign: "center" }}>L{item.descPP}</td>
                <td style={{ textAlign: "center" }}>L{item.descADM}</td>
                <td style={{ textAlign: "center" }}>L{item.descAMN}</td>
                <td style={{ textAlign: "center" }}>L{item.ajuste}</td>
                <td style={{ textAlign: "center" }}>L{item.valorPagado}</td>
                <td style={{ textAlign: "center" }}>L{item.total}</td>
              </tr>
            ))}

          {!loading && facturas.length === 0 && (
            <tr>
              <td colSpan={11} style={{ textAlign: "center" }}>
                NO HAY FACTURAS PENDIENTES DE PAGO
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {facturas.length > registrosPorPagina && !loading && (

        <PaginationControl
          page={paginaActual}
          total={facturas.length}
          between={2}
          changePage={(page: number) => handleCambioPag(page)}
          limit={registrosPorPagina}
        />

      )}


      {/* Sección de "Mis tarjetas de crédito y débito" */}
      <div className="credit-card-section"> {/*Cambiar la logica a un componente reutilizable*/}
        <h3>Mis tarjetas de credito y debito</h3>
        <div className="card-display-container">
          {savedCard ?
            (<div className="mini-card">
              <div className={`mini-card-bg ${savedCard?.type?.toLowerCase() || ""}-bg`}>
                {getCardLogo(savedCard.type) && (
                  <img src={getCardLogo(savedCard.type)} className="mini-card-logo" alt="" />)}
                <p className="mini-card-number">{formatCardNumber(savedCard.number)}</p>
                <p className="mini-card-name">{savedCard.name}</p>
                <p className="saved-card-expiry">Válida hasta {savedCard.expiry}</p>
              </div>
              <div >
                <button className="butto-card" onClick={() => { setShowModals(true) }}
                  title="Editar Tarjeta" >
                  <FontAwesomeIcon icon={faPencil} /> Editar</button>
              </div>
            </div>
            ) : (
              <button className="add-card-link" onClick={() => setShowModals(true)}>Agregar una tarjeta</button>
            )}
          <p className="card-info">
            Aceptamos las principales tarjetas de credito
          </p>

          <ModalsConteiners open={showModals} onClose={() => setShowModals(false)}>
            <div style={{ padding: '20px', color: 'black' }}>
              <CardForm onSave={handleCardSaved} onCancel={() => setShowModals(false)} initialData={savedCard ?? undefined} />
            </div>
          </ModalsConteiners>
        </div>
      </div>

      {/* Total y botones */}
      <div className="payment-summary">
        <p>Total a Pagar: LPS {seleccionCantidad.toLocaleString()}</p>
        <button className="button-cancel">Cancelar</button>
        <Link
          to="/Proceso-Tarjeta"
          className="button-links"
          onClick={handlePayButtonClick}
        >
          Pagar
        </Link>
      </div>

      {/* Modal de advertencia */}

      <Modal isVisible={showCheckboxModal} title="MENSAJE DE ADVERTENCIA" showCloseButton={false} >
        <div style={{ padding: '20px', color: 'black', textAlign: 'center' }}>
          <p>Debe seleccionar al menos un periodo de deuda para continuar con el pago.</p>
          <button className="modal-button"
            onClick={() => setShowCheckboxModal(false)}>Listo</button>
        </div>
      </Modal>

      {/* Modal de advertencia para agregar tarjeta de crédito */}
      <Modal isVisible={showCardRequiredModal} title="MENSAJE DE ADVERTENCIA" showCloseButton={false} >
        <div style={{ padding: '20px', color: 'black', textAlign: 'center' }}>
          <p>Debes agregar una tarjeta de crédito o débito antes de proceder con el pago.</p>
          <button className="modal-button"
            onClick={() => setShowCardRequiredModal(false)}>Listo</button>
        </div>
      </Modal>

      {/* {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <img src="img/error.svg" alt="Advertencia" className="modal-icon" />
            <h3 className="modal-title" style={{ textAlign: "center" }}>
              Mensaje de advertencia
            </h3>
            <p className="modal-message">
              Lo siento, tienes periodos anteriores sin pagar.
            </p>
            <button onClick={closeModal} className="modal-button">
              OK
            </button>
          </div>
        </div>
      )} */}


      {/* Modal de advertencia de selección de checkbox */}
      {/*Cambiar la logica a un componente reutilizable*/}
      {/* {showCheckboxModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <img src="img/error.svg" alt="Advertencia" className="modal-icon" />
            <h3 className="modal-title" style={{ textAlign: "center" }}>
              Mensaje de advertencia
            </h3>
            <p className="modal-message">
              Debe seleccionar al menos un periodo de deuda para continuar con
              el pago.
            </p>

            <button onClick={closeCheckboxModal} className="modal-button">
              OK
            </button>
          </div>
        </div>
      )} */}
      {/* Modal de advertencia para agregar tarjeta de crédito */}
      {/*Cambiar la logica a un componente reutilizable*/}
      {/* {showCardRequiredModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <img src="img/error.svg" alt="Advertencia" className="modal-icon" />
            <h3 className="modal-title" style={{ textAlign: "center" }}>
              Mensaje de advertencia
            </h3>
            <p className="modal-message">
              Debe agregar una tarjeta de crédito o débito antes de proceder el
              pago.
            </p>
            <button
              onClick={() => {
                closeCardRequiredModal();
                openCardModal();
              }}
              className="modal-button"
            >
              OK
            </button>
          </div>
        </div>
      )} */}

      {/* Modal de confirmación */}
      {/*Cambiar la logica a un componente reutilizable*/}
      {/* {showConfirmationModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            {showConfirmationIcon ? (
              <img
                src="img/procesado.svg"
                alt="Confirmación"
                className="modal-icon"
              />
            ) : (
              <div className="loading-circle"></div>
            )}
            <h3 className="modal-title" style={{ textAlign: "center" }}>
              Mensaje de Confirmación
            </h3>
            <p className="modal-message">{confirmationMessage}</p>
            {showOkButton && (
              <Link to="/historial-pagos" className="modal-button">
                OK
              </Link>
            )}
          </div>
        </div>
      )} */}

      {/* Modal desglose de cobro durante transaccion (donde se cobran los 30 lps)*/}
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
              Aqui podra visualizar un desglose de cada cargo que se aplicara a
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
                  <td><strong>Subtotal</strong></td>
                  <td>LPS. {seleccionCantidad.toLocaleString()}</td>
                </tr>
                <tr>
                  <td><strong>Comisión por Servicio Web</strong></td>
                  <td>LPS. 20.00 </td>
                </tr>
                <tr>
                  <td><strong>Valor Neto</strong></td>
                  <td>LPS. {(seleccionCantidad + 20.00).toLocaleString()}</td>
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
                proceder
              </strong>
            </p>

            <div className="pagoBotones">
              <button
                onClick={() => {
                  closeModalDetPago();
                  processPayment();
                }}
                className="modal-button"
              >
                ACEPTO
              </button>
              <button
                onClick={() => {
                  closeModalDetPago();
                }}
                className="modal-button"
              >
                RECHAZO
              </button>
            </div>
          </div>
        </div>
      )}

      {modalProPay && (
        <div className="modal-overlay ">
          <div className="modalPago">
            <h3 className="modal-title" style={{ textAlign: "center" }}>
              Procesando Pago
            </h3><br />
            <Spinner animation="border" variant="success" />
          </div>
        </div>
      )}
      {/* {pagoExitoso && <ReportBI />} */}
      {pagoExitoso && (
        <div className="modal-overlay ">
          <div className="modalPago exitoPago">
            <img src="public/img/procesado.svg" alt="Success" className="modal-icon" />
            <h2 className="modal-title" style={{ textAlign: "center" }}>
              Pago Realizado Exitosamente
            </h2>
            <span>Su codigo de referencia es <strong>90223</strong></span>
            <div className="pagoBotones">

              <button
                className="modal-button"
                onClick={() => {
                  setPagoExitoso(false);
                  // setViewPDF(true);
                  navigate("/recibo-BI", { state: { impuesto: "BIENES INMUEBLES" } });
                }}
              >
                <FaEye /> &nbsp; Visualizar Comprobante
              </button>

              <button
                className="modal-button"
                onClick={() => {
                  setPagoExitoso(false);
                  navigate("/bienes-inmuebles");
                }}>Volver </button>
            </div>
          </div>

        </div>
      )}

      {/* Modal para agregar tarjeta */}
      {/*Cambiar la logica a un componente reutilizable*/}
      {/* {showCardModal && (
        <div className="modal">
          <div className="card-modal-content">
            <h3>Agregue una tarjeta</h3>
            <br />
            <div className="card-modal-body">
              <div className="card-preview">
                {isBackView ? (
                  <div className="card-back">
                    <div className="black-bar"></div>
                    <div className="cvv-box">
                      <span className="cvv-text">{cardCVV || "•••"}</span>
                    </div>
                  </div>
                ) : (
                  <div className="card-image">
                    <p className="card-number">💳 {cardNumber}</p>
                    <p className="card-name">{cardName}</p>
                    <p className="card-expiry">Válida hasta {cardExpiry}</p>
                  </div>
                )}
              </div>

       
              <form className="card-form">
                <label className="textoPrincial">Número de tarjeta</label>
                <input
                  type="text"
                  placeholder="•••• •••• •••• ••••"
                  onChange={handleCardNumberChange}
                  minLength={13}
                  maxLength={19}
                  onFocus={() => setIsBackView(false)}
                />

                <div className="form-row">
                  <div className="form-group">
                    <label className="textoPrincial">Fecha Exp</label>
                    <input
                      type="text"
                      placeholder="MM / YY"
                      onChange={handleCardExpiryChange}
                      maxLength={5}
                      onFocus={() => setIsBackView(false)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="textoPrincial">CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      onChange={handleCardCVVChange}
                      maxLength={3}
                      minLength={3}
                      onFocus={() => setIsBackView(true)}
                      onBlur={() => setIsBackView(false)}
                    />
                  </div>
                </div>

                <label className="textoPrincial">Nombre en la tarjeta</label>
                <input
                  type="text"
                  placeholder="Nombre completo"
                  onChange={handleCardNameChange}
                  maxLength={50}
                  onFocus={() => setIsBackView(false)} />
                <label className="textoPrincial">Direccion de la tarjeta</label>
                <input
                  type="text"
                  placeholder="Calle, Colonia, Ciudad"
                  onChange={handleCardNameChange}
                  maxLength={100}
                  onFocus={() => setIsBackView(false)} />
                <button
                  type="button"
                  className="button-continue"
                  onClick={handleSaveCard}>
                  Agregar
                </button>
                <button
                  type="button"
                  className="button-back"
                  onClick={closeCardModal}>
                  Atrás
                </button>
              </form>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default ProceosFacturacion;