import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import "../../style/renovaciones.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../style/prueba.css";
import Municipalidad from "../../Components/Images/Municipalidad";

const Renovaciones: React.FC = () => {

    const [modalDetPago, setModalDetPago] = useState(false);
    const closeModalDetPago = () => {
        setModalDetPago(false);
    };


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

    return (
        <div className="detalles-impuesto-container">
            <h2 className="title">Renovaciones</h2>
            <Municipalidad />

            <h2 className="titles" style={{ background: "#FF6600" }}>
                Datos del Propietario
            </h2>
            <div className="entity-identification">
                <div className="row">
                    <div className="column">
                        <label>Entidad que realiza declaracion</label>
                        <p>MINI PANADERIA MATEO</p>
                    </div>
                    <div className="column">
                        <label>RTN</label>
                        <p>0801-2001-039738</p>
                    </div>
                    <div className="column">
                        <label>RTM</label>
                        <p></p>
                    </div>
                </div>

                <div className="row">
                    <div className="column">
                        <label>Fecha de inicio operaciones</label>
                        <p>10/09/2021</p>
                    </div>
                    <div className="column">
                        <label>Nombre del propietario / representante legal</label>
                        <p>Juan Marcos Estrada Alvarez</p>
                    </div>
                    <div className="column">
                        <label>Categoria del rubro</label>
                        <p>11.7.1.01.10.0 - Fabricacion de azucar</p>
                    </div>
                </div>

                <div className="row">
                    <div className="column">
                        <label>Direccion del negocio</label>
                        <p>Barrio La Escondida, Valle de Angeles</p>
                    </div>
                    <div className="column">
                        <label>Tipo de declaracion</label>
                        <p>Renovacion</p>
                    </div>
                </div>

            </div>

            <h2 className="titles" style={{ background: "#FF6600" }}>
                Declaración Impuesto IyC
            </h2>
            <div className="entity-identification">
                <div className="row">
                    <div className="column">
                        <label>Ultimo Periodo Declarado</label>
                        <p>2024</p>
                    </div>
                    <div className="column">
                        <label>Periodo de la Declaracion</label>
                        <p>2025</p>
                    </div>
                </div>

                <div className="row">
                    <div className="column">
                        <label>Fecha presentacion</label>
                        <input type="date" className="form-control" />
                    </div>
                </div>

                <div className="row">
                    <div className="column">
                        <label>Forma de calculo del impuesto</label>
                        <p>Base Tabla</p>
                    </div>
                    <div className="column">
                        <label>Categoria del negocio</label>
                        <p>52408-Panaderias</p>
                    </div>
                </div>

                <div className="row">
                    <div className="column">
                        <label>Total Ventas No Reguladas</label>
                        <p>300000.00</p>
                    </div>
                    <div className="column">
                        <label>Total Ventas Sujetas a Control de Precios</label>
                        <p>0.00</p>
                    </div>
                </div>

            </div>



            {/* Total y botones */}
            <div className="botonesRenovaciones">

                <button className="button-cancel">Calcular Impuesto</button>
                <button className="button-cancel">Calcular Ajuste</button>
                <button className="button-cancel">Guardar Declaracion</button>
            </div>
        </div>
    );
};

export default Renovaciones;
