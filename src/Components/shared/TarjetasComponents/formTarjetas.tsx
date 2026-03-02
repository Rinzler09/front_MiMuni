import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "../../../style/PresentacionesStyles/formTarjeta.css"
// Importa tus imágenes aquí
import chipImagen from "../../../assets/chip.png";
import visaImagen from "../../../assets/iconoVisa.png";
import mastercardImagen from "../../../assets/master.png";
import americaExpressImagen from "../../../assets/america.png";
//Nuevas importaciones para la parte de la tarjeta
import { tarjetaPago } from '../../../types/generalForm';
import { useForm } from 'react-hook-form';
import ErrorMessage from "../../../Components/ErrorMessage/MostrarMensajesError";

interface CardData {
    number: string;
    name: string;
    expiry: string;
    cvv?: string;
    type: string;
}

interface CardFormProps {
    onSave: (card: CardData) => void;
    onCancel: () => void;
    initialData?: CardData | null;
}

export default function CardForm({ onSave, onCancel, initialData }: CardFormProps) {
    const [isBackView, setIsBackView] = useState(false);
    const [cardName, setCardName] = useState(initialData?.name || "");
    const [displayCardNumber, setDisplayCardNumber] = useState(initialData?.number || "");
    const [cardExpiry, setCardExpiry] = useState(initialData?.expiry || "");
    const [cardCVV, setCardCVV] = useState(initialData?.cvv || "");
    const [cardType, setCardType] = useState(initialData?.type || "");


    //Importanciones nuevas
    //Validacion de los campos del formulario
    const initialValues: tarjetaPago = { number: "", nombreTarjeta: "", expiry: "", cvv: "", direccion: "" };
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({ defaultValues: initialValues });
    const [expirationDate, setExpirationDate] = useState("");

    const cardImages: { [key: string]: string } = {
        "Visa": visaImagen,
        "Mastercard": mastercardImagen,
        "Amex": americaExpressImagen,
        default: chipImagen,
    };

    const CardImagen = (type: string): string => { // Funcion para obtener el color en la parte de la tarjeta
        if (type === "Visa") return cardImages.Visa;
        if (type === "Mastercard") return cardImages.Mastercard;
        if (type === "Amex") return cardImages.Amex;
        return cardImages.default;
    }

    const cambioTarjeta: Record<string, string> = {
        Visa: "visa-bg",
        Mastercard: "mastercard-bg",
        Amex: "amex-bg",
    };

    //Funcion para obtener el color en la parte de la tarjeta
    const getCardColor = (type: string): string => {
        return cambioTarjeta[type] || "default-bg";
    }

    const currentCardImage = CardImagen(cardType);

    useEffect(() => {
        if (initialData) {
            setDisplayCardNumber(initialData.number || "");
            setCardName(initialData.name || "");
            setCardExpiry(initialData.expiry || "");
            setCardCVV(initialData.cvv || "");
            setCardType(initialData.type || "");

            setValue("number", initialData.number || "");
            setValue("expiry", initialData.expiry || "");
            setValue("cvv", initialData.cvv || "");
            setValue("nombreTarjeta", initialData.name || "");
        }
    }, [initialData, setValue]);


    // Lógica de guardado
    const onSubmit = () => {
        onSave({
            number: displayCardNumber, name: cardName, expiry: cardExpiry, cvv: cardCVV, type: cardType
        });
        onCancel();
    };

    //funcion para la fecha de expiracion de la tarjeta
    const handleExpireInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        let num = e.target.value.replace(/\D/g, ''); // Solo numeros aceptan
        if (num.length > 2) {
            num = num.slice(0, 2) + '/' + num.slice(2, 4);
        }
        if (num.length > 5) {
            num = num.slice(0, 5);
        }
        setExpirationDate(num);
        setCardExpiry(num);
        setValue("expiry", num);
    };

    //Funcion para el numero de la tarjeta
    const formatCardNumber = (value: string) => {
        return value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
    }
    return (
        <>
            <div className="modal">
                <div className="card-modal-content">
                    <h3>Agregue una tarjeta</h3> <br />

                    <div className="card-modal-body">
                        {/* TARJETA ANIMADA 3D */}
                        <div className="card-preview">
                            <motion.div
                                className="flip-card" animate={{ rotateY: isBackView ? 180 : 0 }}
                                transition={{ duration: 0.8, ease: "easeInOut" }}
                                style={{
                                    transformStyle: "preserve-3d", position: "relative",
                                }}>

                                {/* TARJETA FRONTAL */}
                                <div
                                    className={`card-image ${getCardColor(cardType)}`}
                                    style={{ backfaceVisibility: "hidden", position: "absolute", width: "100%", height: "100%", borderRadius: "12px", }}>

                                    <div className="card-logo-container">
                                        <img src={chipImagen} className="chip-logo" alt="chip" />
                                        {cardType && (
                                            <img src={currentCardImage} className="brand-logo" alt={cardType} />
                                        )}
                                    </div>
                                    <p className="card-number">{displayCardNumber || "•••• •••• •••• ••••"}</p>
                                    <p className="card-name">{cardName || "SU NOMBRE AQUÍ"} </p>
                                    <p className="card-expiry">Válida hasta {cardExpiry || "MM / YY"}</p>

                                </div>

                                {/* TARJETA TRASERA */}
                                <div className={`card-back ${getCardColor(cardType)}`}
                                    style={{
                                        backfaceVisibility: "hidden",
                                        transform: "rotateY(180deg)", position: "absolute",
                                        width: "100%", height: "100%", borderRadius: "12px", borderColor: "#000000",
                                    }}>

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
                        <form className="card-form">
                            <label className="textoPrincial"> Número de tarjeta </label>
                            <input type="text" placeholder="•••• •••• •••• ••••"
                                className="textoCambio" maxLength={19} value={displayCardNumber}
                                onFocus={() => setIsBackView(false)}
                                {...register("number", {
                                    required: "El número de tarjeta es obligatorio",
                                    validate: (value) => {
                                        const clean = value.replace(/\s/g, "");
                                        if (clean.length !== 16) { return "El número de tarjeta debe tener 16 dígitos"; }
                                        const isVisa = clean.startsWith("4");
                                        const isMastercard = ["51", "52", "53", "54", "55", "22", "23", "24", "25", "26"].some(prefix => clean.startsWith(prefix));
                                        const isAmex = ["34", "37"].some(prefix => clean.startsWith(prefix));
                                        return isVisa || isMastercard || isAmex || "El número de tarjeta no es válido";
                                    },
                                    onChange: (e) => {
                                        const cleanValue = e.target.value.replace(/\D/g, "");
                                        const formatted = formatCardNumber(cleanValue);
                                        setDisplayCardNumber(formatted);
                                        if (cleanValue.startsWith("4")) {
                                            setCardType("Visa");
                                        } else if (
                                            ["51", "52", "53", "54", "55", "22", "23", "24", "25", "26"].some(prefix =>
                                                cleanValue.startsWith(prefix))
                                        ) {
                                            setCardType("Mastercard");
                                        } else if (["34", "37"].some(prefix => cleanValue.startsWith(prefix))) {
                                            setCardType("Amex");
                                        } else {
                                            setCardType("");
                                        }
                                    },
                                })} />
                            {errors.number && <ErrorMessage>{errors.number.message}</ErrorMessage>}

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="textoPrincial">Fecha Exp</label>
                                    <input type="text" placeholder="MM / YY"
                                        className="textoCambio" maxLength={5} onFocus={() => setIsBackView(false)}
                                        {...register("expiry", {
                                            onChange: handleExpireInput, required: "La fecha de expiración es obligatoria",
                                            validate: (value) => {
                                                const [month, year] = value.split("/");
                                                if (!month || !year) return "Formato inválido";
                                                const meses = Number(month);
                                                const anio = Number(year);
                                                if (meses < 1 || meses > 12) return "Mes inválido";
                                                if (anio < 26 || anio > 34) return "Año invalido debes agregar un existente"

                                                const today = new Date();
                                                const currentMonth = today.getMonth() + 1;
                                                const currentYear = today.getFullYear() % 100;
                                                if (anio === currentYear && meses < currentMonth) {
                                                    return "tarjeta vencida";
                                                }
                                                return true;
                                            }
                                        })} />
                                    {errors.expiry && <ErrorMessage>{errors.expiry.message}</ErrorMessage>}
                                </div>

                                <div className="form-group">
                                    <label className="textoPrincial">CVV</label>
                                    <input type="password" placeholder="123" className="textoCambio"
                                        maxLength={3} minLength={3} onFocus={() => setIsBackView(true)}
                                        {...register("cvv", {
                                            required: "El CVV es obligatorio",
                                            pattern: { value: /^[0-9]{3}$/, message: "El CVV debe tener 3 dígitos" },
                                            onChange: (e) => {
                                                const clean = e.target.value.replace(/\D/g, "");
                                                setCardCVV(clean);
                                                setValue("cvv", clean);
                                            }
                                        })} />
                                </div>
                                {errors.cvv && <ErrorMessage>{errors.cvv.message} </ErrorMessage>}
                            </div>

                            <label className="textoPrincial">Nombre en la tarjeta</label>
                            <input type="text" placeholder="Nombre completo" className="textoCambio" maxLength={30}
                                onFocus={() => setIsBackView(false)}
                                {...register("nombreTarjeta", {
                                    required: "El nombre es obligatorio",
                                    pattern: { value: /^[A-Za-z\s]+$/, message: "El nombre del titular solo debe contener letras" },
                                    onChange: (e) => {
                                        const mayuscula = e.target.value.replace(/[^A-Za-z\s]/g, "").toUpperCase();
                                        setCardName(mayuscula);
                                        setValue("nombreTarjeta", mayuscula);
                                    }
                                })} />
                            {errors.nombreTarjeta && <ErrorMessage>{errors.nombreTarjeta.message} </ErrorMessage>}

                            {/* <label className="textoPrincipal">Dirección de la tarjeta</label>
            <input type="text" className="textoCambio" placeholder="Calle, Colonia, Ciudad" maxLength={100}
              onFocus={() => setIsBackView(false)}
              {...register("direccion", { required: "La dirección es obligatoria",
                pattern: { value: /^[A-Za-z\s]+$/, message: "La direccion solo debe contener letras" },
                })}/>
              {errors.direccion && <ErrorMessage>{errors.direccion.message} </ErrorMessage>} */}

                            <button type="button" className="button-continue" onClick={handleSubmit(onSubmit)}>Agregar</button>
                            <button type="button" className="button-back" onClick={onCancel} >Cancelar</button>

                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}