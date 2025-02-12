import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../style/prueba.css"; // Ensure this file has the necessary styles for your layout
import "../../style/tazas.css";
import Municipalidad from "../Images/Municipalidad";

const TasasMunicipales: React.FC = () => {
  const [selectedRows, setSelectedRows] = useState([true]);
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

  //Seleccion
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showCheckboxModal, setShowCheckboxModal] = useState(false);

  //
  const handlePayButtonClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Verificar si se ha seleccionado al menos un checkbox
    if (selectedYears.length === 0) {
      e.preventDefault();
      setShowCheckboxModal(true);
      return;
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

  //Datos de invension
  const data = [
    {
      periodo: "2021/006",
      descripcion: "Tasas municipales",
      boleta: "0008508275",
      vencimiento: "10/12/2021",
      historico: 1492.08,
      recDesc: 68.82,
      total: 1560.9,
    },
  ];

  // Calcular totales basados en las filas seleccionadas
  const totalHistorico = selectedRows.reduce(
    (acc, isSelected, index) => acc + (isSelected ? data[index].historico : 0),
    0
  );
  const totalRecDesc = selectedRows.reduce(
    (acc, isSelected, index) => acc + (isSelected ? data[index].recDesc : 0),
    0
  );
  const totalTotal = selectedRows.reduce(
    (acc, isSelected, index) => acc + (isSelected ? data[index].total : 0),
    0
  );

  const handleSelectChange = (index: number) => {
    const newSelectedRows = [...selectedRows];
    newSelectedRows[index] = !newSelectedRows[index];
    setSelectedRows(newSelectedRows);
  };

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

  //
  const closeModal = () => setShowModal(false);
  const closeCheckboxModal = () => setShowCheckboxModal(false);
  const closeCardRequiredModal = () => setShowCardRequiredModal(false);
  const openCardModal = () => setShowCardModal(true);
  const closeCardModal = () => setShowCardModal(false);

  //
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
      <h2 className="title">Tasa por Servicio a la Propiedad</h2>
      <Municipalidad />
      <h2 className="titlesss" style={{ background: "#FF6600" }}>
        TASAS MUNICIPALES
      </h2>

      <div className="entity-identification">
        {/* Datos de identificación */}
        <div className="row">
          <div className="column">
            <label>Municipalidad</label>
            <p>Santa Lucia</p>
          </div>
          <div className="column">
            <label>Contribuyente</label>
            <p>Jonathan Ignacio Marley Ramirez</p>
          </div>
        </div>
        <div className="row">
          <div className="column">
            <label>N.Identidad</label>
            <p>0801-2001-03973</p>
          </div>
          <div className="column">
            <label>RTN</label>
            <p>0801-2001-03973-0</p>
          </div>
        </div>
        <div className="row">
          <div className="column">
            <label>Clave Catastral</label>
            <p>0801-2001-03973</p>
          </div>
          <div className="column">
            <label>Direccion</label>
            <p>CALLE NO DECLARADA S/N</p>
          </div>
        </div>
      </div>

      <table className="details-table">
        <thead>
          <tr>
            <th>Periodo</th>
            <th>Descripción</th>
            <th>Boleta</th>
            <th>Vencimiento</th>
            <th>Histórico</th>
            <th>Rec/Desc</th>
            <th>Total</th>
            <th>Selecionar</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row.periodo}</td>
              <td>{row.descripcion}</td>
              <td>{row.boleta}</td>
              <td>{row.vencimiento}</td>
              <td>{row.historico.toFixed(2)}</td>
              <td>{row.recDesc.toFixed(2)}</td>
              <td>{row.total.toFixed(2)}</td>
              <td>
                <input
                  type="checkbox"
                  checked={selectedRows[index]}
                  onChange={() => handleSelectChange(index)}
                />
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan={4}></td>
            <td>
              <strong>Totales:</strong> {totalHistorico.toFixed(2)}
            </td>
            <td>{totalRecDesc.toFixed(2)}</td>
            <td>{totalTotal.toFixed(2)}</td>
            <td>{selectedRows.filter(Boolean).length}</td>
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
      {/* Total y botones */}
      <div className="payment-summary">
        <button className="button-cancel">Cancelar</button>
        <Link
          to="Proceso-FacturacionSV"
          className="button-links"
          onClick={handlePayButtonClick}
        >
          Pagar
        </Link>
      </div>
    </div>
  );
};

export default TasasMunicipales;
