import React, { useState } from 'react';
//Imagenes para la tarjeta
import chipImagen from "../../assets/chip.png";
import visaImagen from "../../assets/iconoVisa.png";
import mastercardImagen from "../../assets/master.png";
import americaExpressImagen from "../../assets/america.png";
import "../../style/ModalesStyles/TarjetasModal/modalTarjetaPago.css"
import { toast, Toaster } from 'sonner';
import { motion } from 'framer-motion'; // Animación 3D con Motion
//Nuevas importaciones para la parte de la tarjeta
import { tarjetaPago } from '../../types/generalForm';

interface Props {
  showCardModal: boolean;
  closeCardModal: () => void;
  onSaveCard: (card: { number: string; name: string; expiry: string; type: string }) => void;
}

const TarjetasPagos: React.FC<Props> = ({ showCardModal, closeCardModal, onSaveCard }) => {

// Define las imágenes de las tarjetas.
const cardImages: { [key: string]: string } = {
  "Visa": visaImagen,
  "Mastercard": mastercardImagen,
  "AmericanExpress": americaExpressImagen,
  "Default": chipImagen,
};

//Objeto para la el cambio de colo
const cambiotarjeta: Record<string, string> = {
  Visa: "visa-bg",
  Mastercard: "mastercard-bg",
  americanExpress: "amex-bg",
};

//Funcion para obtener el color en la parte de la tarjeta
const getCardColor = (type: string): string => {
  return cambiotarjeta[type] || "default-bg";
};

  const [isBackView, setIsBackView] = useState(false);
  const [rawCardNumber, setRawCardNumber] = useState("");
  const [displayCardNumber, setDisplayCardNumber] = useState("•••• •••• •••• ••••");
  const [cardName, setCardName] = useState("SU NOMBRE AQUÍ");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");
  const [deireccion, setDireccion] = useState("");
  const [savedCard, setSavedCard] = useState<{ number: string; name: string; expiry: string } | null>(null);
  const [cardType, setCardType] = useState<string>("");

  // Función que devuelve la imagen de la tarjeta según el tipo
  const CardImagen = (type: string): string => {
    if (type === "Visa") return cardImages.Visa;
    if (type === "Mastercard") return cardImages.Mastercard;
    if (type === "americanExpress") return cardImages.AmericanExpress;
    return cardImages.Default;
  };

  //Validacion de los campos del formulario
  // const initialValues: tarjetaPago = {number: "", name: "", expiry: "", cvv: ""};
  // const {register, handleSubmit, formState: { errors }} = useForm({ defaultValues: initialValues });
 
  //Funcion para enviar datos al componenete 
  const onSubmit = async (formData: tarjetaPago) =>{
    try {
      //Validacion del comprobante de datos en el formulario
      onSaveCard({
        number: rawCardNumber,
        name: cardName,
        expiry: cardExpiry,
        type: cardType,
      });
      closeCardModal();
      
    } catch (error) {
      
    }
  }
 
  //Funcion para manejo de numero de tarjeta
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/[^0-9]/g, "");
    
    if (input.length > 16) {
        input = input.slice(0,16);    
      }
      
    setRawCardNumber(input);

    const NumTarjetas = (number: string): string => {
      const cleanedNumber = number.replace(/\s/g, '');
      if (cleanedNumber.length === 0) return "";    

      if (cleanedNumber.startsWith("4")) {
        return "Visa";
      }

      if (["51", "52", "53", "54", "55", "22", "23", "24", "25", "26"].some(prefix => cleanedNumber.startsWith(prefix))) {
        return "Mastercard";
      }

      if (cleanedNumber.startsWith('34') || cleanedNumber.startsWith('37')) {
        return "americanExpress";
      }

      return "";
    };

    const tipoTarjeta = NumTarjetas(input);
    setCardType(tipoTarjeta);

    const formatted = input.replace(/(.{4})/g, '$1 ').trim();
    setDisplayCardNumber(formatted);

    //Validacion de tarjeta
    if (input.length >= 4 && tipoTarjeta === "") {
      toast.error("Número de tarjeta no válido.");
    }
  };

  const currentCardImage = CardImagen(cardType);

  //Funcion para el nombre en la tarjeta
  const handleCardNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardName(e.target.value.replace(/[^A-Za-z\s]/g, '') || "SU NOMBRE AQUÍ");
  };

  //Funcion de direccion
  const handleDireccionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDireccion(e.target.value.replace(/[^A-Za-z\s]/g, '') || "SU DIRECCION");
  }

  // Fecha de expiración
  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  let value = e.target.value.replace(/\D/g, ""); // solo números

  // Máximo 4 dígitos (MMYY)
  if (value.length > 4) value = value.slice(0, 4);

  let month = value.slice(0, 2);
  let year = value.slice(2, 4);

  //  VALIDAR MES
  if (month.length === 2) {
    const monthNum = Number(month);
    if (monthNum < 1 || monthNum > 12) {
      month = ""; // invalida el mes
    }
  }

  // VALIDAR AÑO
  if (year.length === 2) {
    const yearNum = Number(year);
    if (yearNum < 26 || yearNum > 35) {
      year = ""; // invalida el año
    }
  }

  //  FORMATO FINAL
  let formatted = month;
  if (year.length > 0) {
    formatted += " / " + year;
  }

  setCardExpiry(formatted);
};


  const handleCardCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardCVV(e.target.value);
  };

  {/*Funcion para validar al momento de agregar la tarjeta*/}

  const handleSaveCard = () => {
     const cleaned = rawCardNumber.replace(/\D/g, "");

     if (cleaned.length !== 16) {
    toast.error("El número de tarjeta debe tener exactamente 16 dígitos.");
    return; 
  }

    if (!rawCardNumber.trim()) {
      toast.error("Por favor ingrese el número de la tarjeta.");
      return;
    }

    if (!cardExpiry.trim()) {
      toast.error("Por favor ingrese la fecha de expiración.");
      return;
    }

    if (!cardCVV.trim()) {
      toast.error("Por favor ingrese el CVV.");
      return;
    }

    if (!cardName.trim() || cardName === "SU NOMBRE AQUÍ") {
      toast.error("Debe ingresar el nombre tal como aparece en la tarjeta.");
      return;
    }

    if (!deireccion.trim()) {
      toast.error("Debe ingresar una dirección.");
      return;
    }

    onSaveCard({
      number: rawCardNumber,
      name: cardName,
      expiry: cardExpiry,
      type: cardType,
    });

    closeCardModal();
  };

  if (!showCardModal) return null;

  return (
    <div className="modal">
      <Toaster closeButton position="top-right" richColors />
      <div className="card-modal-content">
        <h3>Agregue una tarjeta</h3>
        <br />

        <div className="card-modal-body">

          {/* TARJETA ANIMADA 3D */}
          <div className="card-preview">

            <motion.div
               className="flip-card"
                animate={{ rotateY: isBackView ? 180 : 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                style={{
                  transformStyle: "preserve-3d",
                  position: "relative",
                }}>

              {/* TARJETA FRONTAL */}
              <div
                className={`card-image ${getCardColor(cardType)}`}
                style={{ backfaceVisibility: "hidden", position: "absolute", width: "100%", height: "100%", borderRadius: "12px",}}>

                <div className="card-logo-container">
                  <img src={chipImagen} className="chip-logo" alt="chip" />

                  {cardType && (
                    <img src={currentCardImage} className="brand-logo" alt={cardType} />
                  )}
                </div>

                <p className="card-number">{displayCardNumber || "•••• •••• •••• ••••"}</p>
                {/* <div className='card-holder-row'> */}
                   <p className="card-name">{cardName}</p>
                   <p className="card-expiry">Válida hasta {cardExpiry || "MM / YY"}</p>
                {/* </div> */}

              </div>

              {/* TARJETA TRASERA */}
              <div
                className={`card-back ${getCardColor(cardType)}`}
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  borderRadius: "12px",
                  borderColor: "#000000",
                }}
              >
                {/* BANDA MAGNÉTICA */}
              <div className="black-bar"></div>

              {/* BANDA DE FIRMA */}
              <div className="signature-strip"></div>

              {/* CVV */}
              <div className="cvv-box">
                <span className="cvv-text">{cardCVV || "•••"}</span>
              </div>
              {/* Agregacion de logo de tarjetas */}
              {cardType && (
                <img src={currentCardImage} className="brand-logo-back" alt={cardType} />
              )}
              </div>

            </motion.div>

          </div>

          {/* FORMULARIO */}
          <form className="card-form" >

            <label className="textoPrincial">Número de tarjeta {cardType && `(${cardType})`}</label>
            <input
              type="text"
              placeholder="•••• •••• •••• ••••"
              value={displayCardNumber}
              className="textoCambio"
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
                  className="textoCambio"
                  value={cardExpiry}
                  onChange={handleCardExpiryChange}
                  maxLength={7}
                  onFocus={() => setIsBackView(false)}
                />
              </div>

              <div className="form-group">
                <label className="textoPrincial">CVV</label>
                <input
                  type="password"
                  placeholder="123"
                  className="textoCambio"
                  onChange={handleCardCVVChange}
                  value={cardCVV}
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
              className="textoCambio"
              value={cardName === "SU NOMBRE AQUÍ" ? "" : cardName}
              // onChange={handleCardNameChange}
              maxLength={50}
              onFocus={() => setIsBackView(false)}
            
            />

            <label className="textoPrincipal">Dirección de la tarjeta</label>
            <input
              type="text"
              className="textoCambio"
              placeholder="Calle, Colonia, Ciudad"
              maxLength={100}
              onChange={handleDireccionChange}
              onFocus={() => setIsBackView(false)}
            />

            <button type="button" className="button-continue" onClick={handleSaveCard}>
              Agregar
            </button>
            <button type="button" className="button-back" onClick={closeCardModal}>
              Cancelar
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default TarjetasPagos;
