import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../style/prueba.css";
import "../../style/modalPago.css";
import Municipalidad from "../Images/Municipalidad";
import { facturasBI } from "../../services/facturasBI";

interface Facturas {
  id: number;
  factura_id: number;
  preciounitario: number;
  descuentoprontopago: number;
  ajuste: number;
  estado: string;
}

const ProceosFacturacion: React.FC = () => {

  /*Se incializan los hook States de los parametros para la factura*/
  const [modalDetPago, setModalDetPago] = useState(false);
  const closeModalDetPago = () => {
    setModalDetPago(false);
  };
  const hacerCobro = () => {

    fetch('https://apex.oracle.com/pls/apex/mapea_hn/apiFacturas/postFacturas/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        {
          "descripcion": descripcion,
          "tipopago": tipoPago,
          "subtotal": montoSubtotal,
          "valortotal": montoTotal,
          "fechapago": fecha,
          "estado": estado,
          "periodo": periodo
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

  /*HOOKS PARA PAGOS A DB INICIAL*/
  const [montoSubtotal, setMontoSubtotal] = useState(6000);
  const [montoTotal, setMontoTotal] = useState(0);
  const [descripcion, setDescripcion] = useState("IMPUESTO MUNICIPAL A LA PROPIEDAD DE BIENES INMUEBLES");
  const [tipoPago, setTipoPago] = useState("Tarjeta Credito");
  const [estado, setEstado] = useState("PAGADO");
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  //new Date() convierte la fecha en un objeto Date, toISOString convierte la fecha en formato YYYY-MM-DDTHH:mm:ss.sssZ y split corta todo lo que sigue despues
  const [periodo, setPeriodo] = useState(1949);

  const calcTotal = (montoSubtotal: number) => {
    setMontoTotal(montoSubtotal + (montoSubtotal * 0.15));
  }

  useEffect(() => {
    calcTotal(montoSubtotal)
  }, [])



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
  // const [idfact, setIdfact] = useState(0);
  // const [factura_id, setFactura_id] = useState(0);
  // const [precio_unitario, setPrecio_unitario] = useState(0);
  // const [desc_PP, setDesc_PP] = useState(0);
  // const [ajuste, setAjuste] = useState(0);
  // const [estadofact, setEstadofact] = useState("A");

  useEffect(() => {
    const fetchFacturas = async () => {
      try {
        //verificamos que usuario se esta usando
        const user = JSON.parse(localStorage.getItem('usuario') || '{}');
        console.log("Usuario para clave", user);

        //le mandamos el usuario como parametro
        const respuesta = await facturasBI(user);

        if (respuesta && Array.isArray(respuesta)) {
          setFacturas(respuesta);
          console.log(respuesta);
        } else {
          console.error("La respuesta de la API no contiene un arreglo:", respuesta);
        }
      } catch (error) {
        console.error("Error obteniendo registros:", error);
      }
    };

    fetchFacturas();
  }, [facturas]);


  //Cuando se clickea el boton pagar se ejecuta el metodo handlePayButtonClick
  //el cual mediante fetch usa un post para enviar el json conteniendo la estrucutar del pago de factura  
  const handlePayButtonClick = (e: React.MouseEvent<HTMLAnchorElement>) => {

    // fetch('https://apex.oracle.com/pls/apex/mapea_hn/apiFacturas/postFacturas/', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(
    //     {
    //       "descripcion": descripcion,
    //       "tipopago": tipoPago,
    //       "subtotal": montoSubtotal,
    //       "valortotal": montoTotal,
    //       "fechapago": fecha,
    //       "estado": estado,
    //       "periodo": periodo
    //     }
    //   ),
    // })
    //   .then(response => {
    //     if (!response.ok) {
    //       throw new Error(`Error en la peticion HTTP: ${response.status}`);
    //     }
    //     return response.text();
    //   })
    //   .then(text => {
    //     console.log('Raw response:', text);
    //     try {
    //       const data = JSON.parse(text);
    //       console.log('Parsed JSON:', data);
    //     } catch (error) {
    //       console.log('La respuesta no es un JSON valido:', text);
    //     }
    //   })
    //   .catch(error => {
    //     console.error('Error:', error);
    //   });

    // Verificar si se ha seleccionado al menos un checkbox
    // if (selectedYears.length === 0) {
    //   e.preventDefault();
    //   setShowCheckboxModal(true);
    //   return;
    // }

    // Validar los años seleccionados
    // if (selectedYears.includes(2020) || selectedYears.includes(2021)) {
    //   // if (!selectedYears.includes(2019)) {
    //   //   e.preventDefault();
    //   //   setShowModal(true);
    //   //   return;
    //   // }
    // }

    // Verificar si hay una tarjeta guardada
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

  return (
    <div className="detalles-impuesto-container">

      <div className="title"><Municipalidad /> ESTADO DE CUENTA BIENES INMUEBLES</div>

      <h2 className="titles" style={{ background: "#FF6600" }}>
        Datos del Inmuebles
      </h2>
      <div className="entity-identification">
        <div className="row">
          <div className="column">
            <label>Muncipalidad</label>
            <p>Santa Lucia</p> {/* Reemplaza por el dato correspondiente */}
          </div>
          <div className="column">
            <label>Cedula de Identidad</label>
            <p>0801-2001-03973</p> {/* Reemplaza por el dato correspondiente */}
          </div>
        </div>

        <div className="row">
          <div className="column">
            <label>ID Bien Inmueble</label>
            <p>17888</p> {/* Reemplaza por el dato correspondiente */}
          </div>
          <div className="column">
            <label>Codigo Catastral</label>
            <p>082303REZARA000298</p>{" "}
            {/* Reemplaza por el dato correspondiente */}
          </div>
        </div>

        <div className="row">
          <div className="column">
            <label>Tipo Propiedad</label>
            <p>xxxxx</p> {/* Reemplaza por el dato correspondiente */}
          </div>
          <div className="column">
            <label>Zona</label>
            <p>Zona 2</p> {/* Reemplaza por el dato correspondiente */}
          </div>
        </div>

        <div className="row">
          <div className="column">
            <label>Area</label>
            <p>152dedef</p> {/* Reemplaza por el dato correspondiente */}
          </div>
          <div className="column">
            <label>Superficie Terreno</label>
            <p>240</p> {/* Reemplaza por el dato correspondiente */}
          </div>
        </div>
        <div className="row">
          <div className="column">
            <label>Cantidad Contrucciones</label>
            <p>1</p> {/* Reemplaza por el dato correspondiente */}
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
        Deudas del Inmuebles
      </h2>
      <table className="details-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>FACTURA_ID</th>
            <th>PRECIO UNITARIO</th>
            <th>DESCUENTO PRONTO PAGO</th>
            <th>AJUSTE</th>
            <th>ESTADO</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {/* se mapea el arreglo facturas y luego se desglosa cada factura */}
          {
            facturas.map((factura) => (

              <tr key={factura.id}>
                <td id="tdID">{factura.id}</td>
                <td id="tdFACTURA_ID">{factura.factura_id}</td>
                <td id="tdPRECIO_UNITARIO">LPS. {factura.preciounitario}</td>
                <td id="tdDESCUENTO_PRONTO_PAGO">LPS. {factura.descuentoprontopago}</td>
                <td id="tdAJUSTE">LPS. {factura.ajuste}</td>
                <td id="tdESTADO">{factura.estado}</td>
                <td>
                  <input type="checkbox" />
                </td>
              </tr>
            ))

          }
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
          to="/Proceso-Tarjeta"
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
            {/* Si el boton Ok tiene un estado activo entonces se procede
            a la vista de  Proceso-Tarjeta*/}
            {showOkButton && (
              <Link to="/Proceso-Tarjeta" className="modal-button">
                OK
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Modal desglose de cobro durante transaccion (donde se cobran los 30 lps)*/}
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
            <p className="modal-title" style={{ textAlign: "center" }}>
              Impuestos Municipalidad
            </p>
            <table className="details-table">
              <thead>
                <tr>
                  <th>DESCUENTOS</th>
                  <th>AJUSTE</th>
                  <th>PAGO BIEN INMUEBLE</th>
                  <th>SUBTOTAL</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>+ 36.39 Lps.</td>
                  <td>- 120.59 Lps.</td>
                  <td>- 13,456.23 Lps.</td>
                  <td>- 13,570.43 Lps.</td>
                </tr>
              </tbody>
            </table>
            <br />
            <p className="modal-title" style={{ textAlign: "center" }}>
              Comision por Servicio Web
            </p>

            <table className="details-table">
              <thead>
                <tr>
                  <th>COMISION USO PLATAFORMA WEB</th>
                  <th>VALORTOTAL</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>- 30.00 Lps.</td>
                  <td>
                    <strong>- 15,605.99 Lps.</strong>
                  </td>
                </tr>
              </tbody>
            </table>

            <br />
            <p className="modal-message">
              Estimado contribuyente, al continuar, acepta que los cobros
              desglosados a continuación son el resultado de el uso de la
              plataforma web y los impuestos municipales. Mi Muni en Línea no se
              responsabiliza por discrepancias o por información incorrecta
              proporcionada en la municipalidad.
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
                  hacerCobro();
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
