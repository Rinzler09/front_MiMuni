import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import "../../style/TarjetasStyles/tarjetasGuardadas.css";
import "../../style/ModalesStyles/TarjetasModal/modalEliminarTarjeta.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";

const TarjetasGuardadas: React.FC = () => {
    /* Instanciamos los hooks */
    const navigate = useNavigate(); /*Hook de navigate*/
    const [modalEliTar, setModalEliTar] = useState(false); //Hook de ventana modal

    const [alias, setAlias] = useState<string>("Mi alias"); /*Hooks de Alias*/
    const [alias2, setAlias2] = useState<string>("Hogar");
    const [alias3, setAlias3] = useState<string>("Trabajo");
    const [alias4, setAlias4] = useState<string>("Viajes");
    const [Editable, setEditable] = useState<boolean>(false); /*Hook estado editable*/
    const [colorEditar, setColorEditar] = useState<string>('rgb(130, 130, 0)'); /*Hook estado color boton editable*/

    const [tarjetaBorrar, setTarjetaBorrar] = useState<HTMLElement | null>(null);/*Hook para guardar el elemento target de la targeta que se eliminara*/
    /* Funciones */

    /*Alias Handler*/
    const actualizarAlias = (indice: number, alias: string) => {
        switch (indice) {
            case 1:
                setAlias(alias);
                break;
            case 2:
                setAlias2(alias);
                break;
            case 3:
                setAlias3(alias);
                break;
            case 4:
                setAlias4(alias);
                break;
            default:
                break;
        }
    };

    const showModalEliTar = () => {
        setModalEliTar(true);
    };

    const closeModalEliTar = () => {
        setModalEliTar(false);
    };

    const addNewCard = (e: React.FormEvent) => {
        e.preventDefault();
        navigate("/administrador-tarjetas");
    };


    /*Con esta funcion cambiamos el estado de Editable*/
    const toggleEditable = () => {
        setEditable(!Editable)
    };


    /*Funcion cambio de color boton editar*/
    const toggleColorBtn = () => {
        setColorEditar(colorEditar === 'rgb(146, 29, 0)' ?
            '' : 'rgb(146, 29, 0)')
    };

    /*Funcion para eliminar tarjeta guardada*/
    //para eventos onClick se usa MouseEvent 
    const eliminarCard = () => {
        if (tarjetaBorrar) { // si existe el hook
            tarjetaBorrar.remove();
            console.log("Tarjeta Eliminada"); 
        } else {
            console.log("No se encontro tarjeta");
        }
    }

    return (

        <div className="admin-tarjetas-container">
            <h2 className="admin-title"><br />Tarjetas Guardadas</h2>

            <div className='container-card'>
                <button className='btnAddCard' lang='es' onClick={addNewCard}>
                    Añadir Tarjeta
                </button>
            </div>
            <div className="card-form-container">
                {/* Contenedor de Tarjetas Guardadas */}
                <div className="card-form-container">


                    <div className='card&alias-container'>
                        <div className='card-alias'>
                            <input type='text' value={alias} onChange={(e) => actualizarAlias(1, e.target.value)} title="Digite un alias para la tarjeta" readOnly={!Editable} /*readOnly = true*/ />
                            <button onClick={() => {
                                toggleEditable();
                                toggleColorBtn();
                            }} style={{ backgroundColor: colorEditar }} title="Editar alias">
                                <FontAwesomeIcon icon={faPencil} />
                            </button>
                        </div>
                        {/* Tarjeta de Crédito */}
                        <div id="tarjetaAzul" className="credit-card" style={{ backgroundColor: 'yellow' }} >
                            <div className="card-chip">
                                ==(&nbsp;)== {/*Diseño del Chip*/}
                            </div>
                            <div className="card-logo">VISA</div>
                            <div className="card-number">1111 1111 1111 1111</div>
                            <div className="card-holder">
                                <span>Emilio Izaguirre</span>
                            </div>
                            <div className="card-expiry"><br /> Valida hasta <strong>12 / 26</strong></div>

                            <div className="btn_EliminarCard">
                                <button onClick={(e) => {
                                    showModalEliTar();/*se muestra la ventana modal para las tarjetas*/
                                    const target = e.target as HTMLElement;// se define e.target como un elemento HTML
                                    const tarjetaEliminar = target.closest('.credit-card')?.parentElement; // closest busca la clase padre con nombre especifico luego ? 
                                    // sirve como optional chaining para que no devuelva null y parentElement es el padre del closest
                                    setTarjetaBorrar(tarjetaEliminar || null);
                                    console.log(tarjetaBorrar);
                                }
                                }>
                                    <i className="fas fa-trash-alt"></i> {/* Ícono de basura */}
                                </button>
                            </div>
                        </div>
                    </div>


                    <div className='card&alias-container'>
                        <div className='card-alias'>
                            <input type='text' value={alias2} onChange={(e) => actualizarAlias(2, e.target.value)} title="Digite un alias para la tarjeta" readOnly={!Editable} /*readOnly = true*/ />
                            <button onClick={() => {
                                toggleEditable();
                                toggleColorBtn();
                            }} title="Editar alias">
                                <FontAwesomeIcon icon={faPencil} />
                            </button>
                        </div>
                        <div id="tarjetaNaranja" className="credit-card" style={{ backgroundColor: 'rgb(194, 81, 0)' }}>
                            <div className="card-chip">
                                ==(&nbsp;)== {/*Diseño del Chip*/}
                            </div>
                            <div className="card-logo">VISA</div>
                            <div className="card-number">5555 5555 5555 5555</div>
                            <div className="card-holder">
                                <span>Emilio Izaguirre</span>
                            </div>
                            <div className="card-expiry"><br /> Valida hasta <strong>11 / 25</strong></div>

                            <div className="btn_EliminarCard">
                                <button onClick={(e) => {
                                    showModalEliTar();/*se muestra la ventana modal para las tarjetas*/
                                    const target = e.target as HTMLElement;// se define e.target como un elemento HTML
                                    const tarjetaEliminar = target.closest('.credit-card')?.parentElement; // closest busca la clase padre con nombre especifico luego ? 
                                    // sirve como optional chaining para que no devuelva null y parentElement es el padre del closest
                                    setTarjetaBorrar(tarjetaEliminar || null);
                                    console.log(tarjetaBorrar);
                                }
                                }>
                                    <i className="fas fa-trash-alt"></i> {/* Ícono de basura */}
                                </button>
                            </div>

                        </div>
                    </div>


                    <div className='card&alias-container'>
                        <div className='card-alias'>
                            <input type='text' value={alias3} onChange={(e) => actualizarAlias(3, e.target.value)} title="Digite un alias para la tarjeta" readOnly={!Editable} /*readOnly = true*/ />
                            <button onClick={() => {
                                toggleEditable();
                                toggleColorBtn();
                            }} title="Editar alias">
                                <FontAwesomeIcon icon={faPencil} />
                            </button>
                        </div>
                        <div id="tarjetaPurpura" className="credit-card" style={{ backgroundColor: 'rgb(179, 75, 51)' }}>
                            <div className="card-chip">
                                ==(&nbsp;)== {/*Diseño del Chip*/}
                            </div>
                            <div className="card-logo">VISA</div>
                            <div className="card-number">2222 2222 2222 2222</div>
                            <div className="card-holder">
                                <span>Emilio Izaguirre</span>
                            </div>
                            <div className="card-expiry"><br /> Valida hasta <strong>08 / 27</strong></div>

                            <div className="btn_EliminarCard">
                                <button onClick={(e) => {
                                    showModalEliTar();/*se muestra la ventana modal para las tarjetas*/
                                    const target = e.target as HTMLElement;// se define e.target como un elemento HTML
                                    const tarjetaEliminar = target.closest('.credit-card')?.parentElement; // closest busca la clase padre con nombre especifico luego ? 
                                    // sirve como optional chaining para que no devuelva null y parentElement es el padre del closest
                                    setTarjetaBorrar(tarjetaEliminar || null);
                                    console.log(tarjetaBorrar);
                                }
                                }>
                                    <i className="fas fa-trash-alt"></i> {/* Ícono de basura */}
                                </button>
                            </div>
                        </div>
                    </div>




                    <div className='card&alias-container'>
                        <div className='card-alias'>
                            <input type='text' value={alias4} onChange={(e) => actualizarAlias(4, e.target.value)} title="Digite un alias para la tarjeta" readOnly={!Editable} /*readOnly = true*/ />
                            <button onClick={() => {
                                toggleEditable();
                                toggleColorBtn();
                            }} title="Editar alias">
                                <FontAwesomeIcon icon={faPencil} />
                            </button>
                        </div>
                        <div id="tarjetaVerde" className="credit-card" style={{ backgroundColor: 'green' }}>
                            <div className="card-chip">
                                ==(&nbsp;)== {/*Diseño del Chip*/}
                            </div>
                            <div className="card-logo">VISA</div>
                            <div className="card-number">3333 3333 3333 3333</div>
                            <div className="card-holder">
                                <span>Emilio Izaguirre</span>
                            </div>
                            <div className="card-expiry"><br /> Valida hasta <strong>04 / 29</strong></div>

                            <div className="btn_EliminarCard">
                                <button onClick={(e) => {
                                    showModalEliTar();/*se muestra la ventana modal para las tarjetas*/
                                    const target = e.target as HTMLElement;// se define e.target como un elemento HTML
                                    const tarjetaEliminar = target.closest('.credit-card')?.parentElement; // closest busca la clase padre con nombre especifico luego ? 
                                    // sirve como optional chaining para que no devuelva null y parentElement es el padre del closest
                                    setTarjetaBorrar(tarjetaEliminar || null);
                                    console.log(tarjetaBorrar);
                                }
                                }>
                                    <i className="fas fa-trash-alt"></i> {/* Ícono de basura */}
                                </button>
                            </div>

                        </div>
                    </div>



                </div>

            </div>

            {/* Modal desglose de cobro durante transaccion (donde se cobran los 30 lps)*/}
            {
                modalEliTar && (
                    <div className="modal-overlay ">
                        <div className="modalEliminarTarjeta">
                            <h3 className="modal-title" style={{ textAlign: "center" }}>
                                <img
                                    src="img/alert.svg"
                                    alt="alertaPago"
                                    className="modal-icon"
                                />{" "}
                                &nbsp; Mensaje de Advertencia
                            </h3>

                            <br />
                            <p className="modal-message">
                                Estimado contribuyente usted esta apunto de eliminar una tarjeta guardada.
                                <br />
                                <br />
                                <strong>
                                    ¿Desea proceder?
                                </strong>
                            </p>

                            <div className="eliminarBotones">
                                <button
                                    onClick={() => {
                                        eliminarCard();
                                        closeModalEliTar();
                                    }}
                                    className="modal-button"
                                >
                                    CONTINUAR
                                </button>
                                <button
                                    onClick={() => {
                                        closeModalEliTar();
                                    }}
                                    className="modal-button"
                                >
                                    CANCELAR
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

        </div >

    );
};

export default TarjetasGuardadas;
