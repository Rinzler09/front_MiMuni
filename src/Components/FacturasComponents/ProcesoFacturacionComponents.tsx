import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../style/FacturasStyles/facturasBI.css"
import "../../style/ModalesStyles/TarjetasModal/modalAddTarjeta.css"
import "../../style/PagesStyles/titulo_TablasStyle.css"

import { facturaBienesInmueble } from "../../services/facturasBI";
import { useAuth } from "../../Auth/AuthContext";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

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
}

const ProceosFacturacion: React.FC = () => {

  /*Se incializan los hook States de los parametros para la factura*/
  const [modalDetPago, setModalDetPago] = useState(false);
  const closeModalDetPago = () => {
    setModalDetPago(false);
  };
  const { state } = useLocation() as { state: LocationState };
  const { claveCat, direccion } = state;
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);




  const [selectedAmount, setSelectedAmount] = useState(0);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showCheckboxModal, setShowCheckboxModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [showCardRequiredModal, setShowCardRequiredModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showConfirmationIcon, setShowConfirmationIcon] = useState(false);
  const [showOkButton, setShowOkButton] = useState(false);
  const [confirmationMessage, setConfirmationMessage] =
    useState("Procesando...");
  // Estados para los datos de la tarjeta
  const [cardNumber, setCardNumber] = useState("•••• •••• •••• ••••");
  const [cardName, setCardName] = useState("SU NOMBRE AQUÍ");
  const [cardExpiry, setCardExpiry] = useState("MM / YY");
  const [cardCVV, setCardCVV] = useState("");
  const [isBackView, setIsBackView] = useState(false);
  const [savedCard, setSavedCard] = useState<{
    number: string;
    name: string;
    expiry: string;
  } | null>(null);
  //Cambiar los colores
  const [cardColor, setCardColor] = useState(""); // Estado para el color de la tarjeta

  const handleCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    amount: number,
    year: number
  ) => {
    if (event.target.checked) {
      setSelectedAmount(selectedAmount + amount);
      setSelectedYears([...selectedYears, year].sort());
    } else {
      setSelectedAmount(selectedAmount - amount);
      setSelectedYears(selectedYears.filter((y) => y !== year));
    }
  };


  /*HOOKS PARA PAGOS A DB GEOREDES*/
  const [facturas, setFacturas] = useState<Facturas[]>([]);

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 5;


  // Cálculo de los índices para la paginación
  const indUltimoReg = paginaActual * registrosPorPagina;
  const indPrimerReg = indUltimoReg - registrosPorPagina;
  const facturasActuales = facturas.slice(indPrimerReg, indUltimoReg);


  const { user, selectedMunicipality } = useAuth();

  const token = sessionStorage.getItem("access_TKN");

  // 2) Declaramos la clave catastral en el estado o la recibimos de alguna parte
  //const [claveCat, setClaveCat] = useState("CU238"); // ejemplo

  useEffect(() => {
    const fetchFacturas = async () => {
      try {
        if (!selectedMunicipality || !user?.token) return;

        const respuesta = await facturaBienesInmueble(selectedMunicipality, claveCat, token);

        if (respuesta && Array.isArray(respuesta)) {
          setFacturas(respuesta);
        } else {
          console.error("La respuesta de la API no contiene un arreglo:", respuesta);
        }
      } catch (error) {
        //console.error("Error obteniendo registros:", error);

      }
    };

    fetchFacturas();
  }, [claveCat, selectedMunicipality, user]);

  //Cuando se clickea el boton pagar se ejecuta el metodo handlePayButtonClick
  //el cual mediante fetch usa un post para enviar el json conteniendo la estrucutar del pago de factura  
  const handlePayButtonClick = (e: React.MouseEvent<HTMLAnchorElement>) => {

    if (!savedCard) {
      e.preventDefault();
      setShowCardRequiredModal(true);
      return;
    }

    e.preventDefault();
    setModalDetPago(true);

  };

  const closeModal = () => setShowModal(false);
  const closeCheckboxModal = () => setShowCheckboxModal(false);
  const closeCardRequiredModal = () => setShowCardRequiredModal(false);
  const openCardModal = () => setShowCardModal(true);
  const closeCardModal = () => setShowCardModal(false);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\s+/g, "");
    const formattedValue = rawValue.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(formattedValue || "•••• •••• •••• ••••");
  };

  const handleCardNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardName(e.target.value || "SU NOMBRE AQUÍ");
  };

  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardExpiry(e.target.value || "MM / YY");
  };

  const handleCardCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardCVV(e.target.value);
  };

  const handleSaveCard = () => {
    setSavedCard({
      number: cardNumber,
      name: cardName,
      expiry: cardExpiry,
    });
    closeCardModal();
  };

  //Implementacion para la seleccion de checkbox en la facturas
  const [selectItems, setSelectedItems] = useState<number[]>([]);
  //vereficacion si se han seleccionado todas la facturas
  const allSelected = facturasActuales.length > 0 && selectItems.length === facturasActuales.length;

  //Seleccion global de todas las facturas
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allIndices = facturasActuales.map((_, index) => index);
      setSelectedItems(allIndices);

      // Calcular el total de las facturas seleccionadas
      const totalSum = facturasActuales.reduce((acc, item) => {
        return acc + Number(item.total);
      }, 0);
      setSelectedAmount(totalSum);
    } else {
      setSelectedItems([]);
      setSelectedAmount(0);
    }
  };

  //Seleccion individual de cada factura
  const handleRowSelect = (index: number) => {
    //se utiliza el array de facturasActuales
    const factura = facturasActuales[index];
    const valorNumerico = Number(factura.total);
    if (selectItems.includes(index)) {
      setSelectedItems(prev => prev.filter(i => i !== index));
      setSelectedAmount(prev => prev - valorNumerico);
    } else {
      setSelectedItems(prev => [...prev, index]);
      setSelectedAmount(prev => prev + valorNumerico);
    }
  }

  return (
    <div className="detalles-impuesto-container">

      <div className="title" style={{ textAlign: "center" }}> ESTADO DE CUENTA BIENES INMUEBLES</div>

      <h2 className="subTitles">Datos del Inmueble</h2>

      <table className="details-table">
        <thead>
          <tr>
            <th>Clave Catastral</th>
            <th>DNI</th>
            <th>Dirección</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ textAlign: "center" }} >{claveCat}</td>
            <td style={{ textAlign: "center" }}>0801-2001-03973</td>
            <td style={{ textAlign: "center" }}>{direccion}</td>
          </tr>


        </tbody>
      </table>

      <br />


      <br />

      {/* Datos de las Tablas*/}
      <table className="details-table">
        <thead>
          <tr>
            <th><input type="checkbox" checked={allSelected} onChange={handleSelectAll} /></th>
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
          {loading}

          {facturasActuales.map((item, index) => (
            <tr key={index}>
              <td style={{ textAlign: "center" }}><input type="checkbox" checked={selectItems.includes(index)} onChange={() => handleRowSelect(index)} /></td>
              <td style={{ textAlign: "center" }}>{item.numFactura}</td>
              <td style={{ textAlign: "center" }}>{item.fechaVence}</td>
              <td style={{ textAlign: "center" }}>{item.descripcion}</td>
              <td style={{ textAlign: "center" }}>L{item.subtotal}</td>
              <td style={{ textAlign: "center" }}>L{item.descPP} </td>
              <td style={{ textAlign: "center" }}>L{item.descADM}</td>
              <td style={{ textAlign: "center" }} >L{item.descAMN}</td>
              <td style={{ textAlign: "center" }}>L{item.ajuste}</td>
              <td style={{ textAlign: "center" }}>L{item.valorPagado}</td>
              <td style={{ textAlign: "center" }}>L{item.total}</td>
            </tr>
          ))}
        </tbody>
      </table>



      {/* Sección de "Mis tarjetas de crédito y débito" */}
      <div className="credit-card-section"> {/*Cambiar la logica a un componente reutilizable*/}
        <h3>Mis tarjetas de credito y debito</h3>
        <div className="add-card">
          <span className="card-icon">💳</span>
          {savedCard ? (
            <div className="saved-card-info">
              <p className="saved-card-number">{savedCard.number}</p>
              <p className="saved-card-name">{savedCard.name}</p>
              <p className="saved-card-expiry">
                Válida hasta {savedCard.expiry}
              </p>
            </div>
          ) : (
            <a
              href="#"
              className="add-card-link"
              onClick={(e) => {
                e.preventDefault();
                openCardModal();
              }}
            >
              Agregar una tarjeta de credito o debito
            </a>
          )}
          <p className="card-info">
            Aceptamos las principales tarjetas de credito
          </p>
        </div>
      </div>

      {/* Total y botones */}
      <div className="payment-summary">
        <p>Total a Pagar: LPS {selectedAmount.toLocaleString()}</p>
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
      {/*Cambiar la logica a un componente reutilizable*/}
      {showModal && (
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
      )}

      {/* Modal de advertencia de selección de checkbox */}
      {/*Cambiar la logica a un componente reutilizable*/}
      {showCheckboxModal && (
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
      )}
      {/* Modal de advertencia para agregar tarjeta de crédito */}
      {/*Cambiar la logica a un componente reutilizable*/}
      {showCardRequiredModal && (
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
      )}

      {/* Modal de confirmación */}
      {/*Cambiar la logica a un componente reutilizable*/}
      {showConfirmationModal && (
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
            {/* Si el boton Ok tiene un estado activo entonces se procede
            a la vista de  Proceso-Tarjeta*/}
            {showOkButton && (
              <Link to="/historial-pagos" className="modal-button">
                OK
              </Link>
            )}
          </div>
        </div>
      )}

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
                  <td>5,528.00 LPS.</td>
                </tr>
                <tr>
                  <td><strong>Comisión por Servicio Web</strong></td>
                  <td>30.00 LPS.</td>
                </tr>
                <tr>
                  <td><strong>Valor Neto</strong></td>
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
              <button
                onClick={() => {
                  closeModalDetPago();
                  //hacerCobro();
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

      {/* Modal para agregar tarjeta */}
      {/*Cambiar la logica a un componente reutilizable*/}
      {showCardModal && (
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

              {/* Formulario de entrada de datos de tarjeta */}
              {/*Cambiar la logica a un componente reutilizable*/}
              <form className="card-form">
                <label className="textoPrincial">Número de tarjeta</label>
                <input
                  type="text"
                  placeholder="•••• •••• •••• ••••"
                  onChange={handleCardNumberChange}
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
      )}
    </div>
  );
};

export default ProceosFacturacion;