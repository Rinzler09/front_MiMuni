import React, { useState } from "react";
import "../../../style/TarjetasStyles/agregarTarjeta.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const AdministradorTarjetas: React.FC = () => {

  const navigate = useNavigate();
  const [cardNumber, setCardNumber] = useState<string>("•••• •••• •••• ••••");
  const [cardExpiry, setCardExpiry] = useState<string>("MM / YY");
  // const [cardCVV, setCardCVV] = useState<string>("888");
  const [cardName, setCardName] = useState<string>("SU NOMBRE AQUÍ");

  const goBack = () => {
    navigate("/editar-perfil")
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\s+/g, "");
    const formattedValue = rawValue.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(formattedValue || "•••• •••• •••• ••••");
    e.target.value = formattedValue;
  };

  const handleCardExpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    const formattedValue =
      rawValue.length > 2 ?
        `${rawValue.slice(0, 2)} / ${rawValue.slice(2)}` : rawValue;

    setCardExpiry(formattedValue || " MM / YY");
    e.target.value = formattedValue;
  };


  const handleCardNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    setCardName(rawValue || "Digite su nombre");
  };

  const handleSaveCard = () => {

    fetch('https://apex.oracle.com/pls/apex/mapea_hn/apiTarjetas/postTarjetas/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        {
          "num_tarjeta": cardNumber,
          "cvv": "888",
          "nombre_tarjeta": cardName,
          "fecha_exp": "2025-05-30",
          "estado": 1
        }
      ),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error en la peticion HTTP: ${response.status}`);
        }
        return response.text();
      })
      .then(text => {
        console.log('Raw response:', text);
        try {
          const data = JSON.parse(text);
          console.log('Parsed JSON:', data);
        } catch (error) {
          console.log('La respuesta no es un JSON valido:', text);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });

  };


  return (
    <div className="agregarTarjeta">
      <div className="admin-tarjetas-container">
        <h2 className="admin-title">Agregar Tarjeta</h2>

        <button className="btnBack" onClick={goBack}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>

        <div className="card-form-container">
          {/* Contenedor de la Tarjeta de Crédito */}
          <div className="credit-card-container">
            {/* Tarjeta de Crédito */}
            <div className="credit-card">
              <div className="card-chip"></div>
              <div className="card-logo">VISA</div>
              <div className="card-number">{cardNumber}</div>
              <div className="card-holder">
                <span>{cardName}</span>
              </div>
              <div className="card-expiry"><br /> Valida hasta {cardExpiry}</div>
            </div>
          </div>

          {/* Formulario de Ingreso de Datos */}
          <div className="card-form">
            <label><strong>Número de tarjeta</strong></label>
            <input type="text" placeholder="•••• •••• •••• ••••" maxLength={19}
              required pattern="[0-9]" title="Digite su numero de tarjeta" onChange={handleCardNumberChange} />

            <div className="form-row">
              <div className="form-group">
                <label>Fecha Exp</label>
                <input type="text" placeholder="MM / YYYY" maxLength={7} required
                  pattern="[0-9]" title="Digite Fecha de Expiracion" onChange={handleCardExpChange} />
              </div>
              <div className="form-group">
                <label>CVV</label>
                <input type="text" placeholder="123" />
              </div>
            </div>

            <label><strong>Nombre en la tarjeta</strong></label>
            <input type="text" placeholder="Nombre Apellido" maxLength={19}
              pattern="[A-Z]" title="Digite su Nombre" required onChange={handleCardNameChange} />

            <button className="save-button" onClick={handleSaveCard}>Guardar</button>

            <p className="info-text">
              Todas las tarjetas registradas con este método, son válidas
              únicamente para la pasarela de pagos de Banco del País.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdministradorTarjetas;
