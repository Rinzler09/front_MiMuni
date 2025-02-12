import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../style/prueba.css";
import Municipalidad from "../Images/Municipalidad";

const ProceosFacturacion: React.FC = () => {
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

  const handlePayButtonClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Verificar si se ha seleccionado al menos un checkbox
    if (selectedYears.length === 0) {
      e.preventDefault();
      setShowCheckboxModal(true);
      return;
    }

    // Validar los años seleccionados
    if (selectedYears.includes(2020) || selectedYears.includes(2021)) {
      if (!selectedYears.includes(2019)) {
        e.preventDefault();
        setShowModal(true);
        return;
      }
    }

    // Verificar si hay una tarjeta guardada
    if (!savedCard) {
      e.preventDefault();
      setShowCardRequiredModal(true);
      return;
    }

    e.preventDefault();
    setShowConfirmationModal(true);
    setShowConfirmationIcon(false);
    setShowOkButton(false);
    setConfirmationMessage("Procesando...");

    setTimeout(() => {
      setShowConfirmationIcon(true);
      setConfirmationMessage("Pago facturado");
      setShowOkButton(true);
    }, 3000);
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

  return (
    <div className="detalles-impuesto-container">
      <h2 className="title">
        FACTURACION DE IMPUESTO DE INDUDSTRIAS, COMERCIOS Y SERVICIOS
      </h2>
      <Municipalidad />
      <h2
        className="titles"
        style={{ background: "#FF6600", fontSize: "15px" }}
      >
        DATOS DEL CONTRIBUYENTE
      </h2>
      <div className="entity-identification">
        <div className="row">
          <div className="column">
            <label>Municipalidad</label>
            <p>Santa Lucia</p> {/* Reemplaza por el dato correspondiente */}
          </div>
          <div className="column">
            <label>N.Identidad</label>
            <p>0801-2001-03973</p> {/* Reemplaza por el dato correspondiente */}
          </div>
        </div>

        <div className="row">
          <div className="column">
            <label>RNT</label>
            <p>0801-2001-03973-0</p>{" "}
            {/* Reemplaza por el dato correspondiente */}
          </div>
          <div className="column">
            <label>RTM</label>
            <p>KEHFCSF</p> {/* Reemplaza por el dato correspondiente */}
          </div>
        </div>
        <div className="row">
          <div className="column">
            <label>NOMBRE</label>
            <p>HODNUTEL</p> {/* Reemplaza por el dato correspondiente */}
          </div>
          <div className="column">
            <label>Direccion</label>
            <p>CALLE NO DECLARADA S/N</p>{" "}
            {/* Reemplaza por el dato correspondiente */}
          </div>
        </div>
      </div>
      {/* Datos de las Tablas*/}
      <h2 className="titlesss" style={{ background: "#FF6600" }}>
        PERIODOS DE PAGOS
      </h2>
      <table className="details-table">
        <thead>
          <tr>
            <th>IMPUESTO</th>
            <th>PERIODO</th>
            <th>PRECIO UNIT</th>
            <th>RECARGO ACTUAL</th>
            <th>SUBTOTAL</th>
            <th>TOTAL</th>
            <th>REALIZAR PAGO</th>
          </tr>
        </thead>
        <tbody>
          {/* Año 2021 */}
          <tr>
            <td style={{ textAlign: "center" }}>
              INDUSTRIA,COMERCIOS Y SERVICIOS
            </td>
            <td style={{ textAlign: "center" }}>2019</td>
            <td style={{ textAlign: "center" }}>893.79</td>
            <td style={{ textAlign: "center" }}>0.00</td>
            <td style={{ textAlign: "center" }}>893.79</td>
            <td style={{ textAlign: "center" }}>1,190.00</td>
            <td style={{ textAlign: "center" }}>
              <input
                type="checkbox"
                onChange={(e) => handleCheckboxChange(e, 1190, 2019)}
              />
            </td>
          </tr>
          {/* Año 2024 */}
          <tr>
            <td style={{ textAlign: "center" }}>
              INDUSTRIA,COMERCIOS Y SERVICIOS
            </td>
            <td style={{ textAlign: "center" }}>2020</td>
            <td style={{ textAlign: "center" }}>912.79</td>
            <td style={{ textAlign: "center" }}>223.00</td>
            <td style={{ textAlign: "center" }}>893.79</td>
            <td style={{ textAlign: "center" }}>1,303.79</td>
            <td style={{ textAlign: "center" }}>
              <input
                type="checkbox"
                onChange={(e) => handleCheckboxChange(e, 1303, 2019)}
              />
            </td>
          </tr>
        </tbody>
      </table>

      {/* Sección de "Mis tarjetas de crédito y débito" */}
      <div className="credit-card-section">
        <h3>Mis tarjetas de crédito y débito</h3>
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
              Agregar una tarjeta de crédito o débito
            </a>
          )}
          <p className="card-info">
            Aceptamos las principales tarjetas de crédito
          </p>
        </div>
      </div>

      {/* Total y botones */}
      <div className="payment-summary">
        <p>Total a Pagar: LPS {selectedAmount.toLocaleString()}</p>
        <button className="button-cancel">Cancelar</button>
        <Link
          to="Proceso-FacturacionPDF"
          className="button-links"
          onClick={handlePayButtonClick}
        >
          Pagar
        </Link>
      </div>

      {/* Modal de advertencia */}
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
            {showOkButton && (
              <Link to="/Proceso-FacturacionPDF" className="modal-button">
                OK
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Modal para agregar tarjeta */}
      {showCardModal && (
        <div className="modal">
          <div className="modal-content card-modal-content">
            <h3>Seleccione una tarjeta de crédito.</h3>
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
                    <div className="chip-icon">💳</div>
                    <p className="card-number">{cardNumber}</p>
                    <p className="card-name">{cardName}</p>
                    <p className="card-expiry">Válida hasta {cardExpiry}</p>
                  </div>
                )}
              </div>

              {/* Formulario de entrada de datos de tarjeta */}
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
                  onFocus={() => setIsBackView(false)}
                />
                <button
                  type="button"
                  className="button-continue"
                  onClick={handleSaveCard}
                >
                  Agregar
                </button>
                <button
                  type="button"
                  className="button-back"
                  onClick={closeCardModal}
                >
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
