import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import "../style/PagesStyles/registroUser.css";
import Municipalidad from '../Components/ImagesComponents/Municipalidad';



const RegistrarUsuario: React.FC = () => {
    const [showModalDatos, setShowModalDatos] = useState(false);

    // const closeModal = () => setShowModalDatos(false);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = () => {
        navigate('/')
    };

    const mostrarModalExito = (e: React.FormEvent) => {
        e.preventDefault();
        setShowModalDatos(true);
    }


    return (
        <div className="container mt-5">
            <br />

            <div className='logoMuni'>
                <Municipalidad />
            </div>
            <br />

            <div className='divTitle'>
                <h2 className="mb-4" >Ingrese sus datos personales</h2>
            </div>

            <form id='datosPersonales' onSubmit={mostrarModalExito}>

                <div className='form-container'>
                    <div className="row mb-3 linea">
                        <div className="col-md-6">
                            <label htmlFor="firstName" className="form-label">
                                Nombre
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="lastName" className="form-label">
                                Apellido
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                required
                            />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label htmlFor="correo" className="form-label">
                                Correo Electronico
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="identidad" className="form-label">
                                Numero de Identidad
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                required
                            />
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="estadoCivil" className="form-label">
                                Estado Civil
                            </label>
                            <select name='estadoCivil' form='datosPersonales' className="form-control">
                                <option>Soltero</option>
                                <option>Casado</option>
                                <option>Union Libre</option>
                                <option>Divorciado</option>
                            </select>
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="rtn" className="form-label">
                                RTN
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                required
                            />
                        </div>


                        <div className="col-md-6">
                            <label htmlFor="sexo" className="form-label">
                                Sexo
                            </label>
                            <select name='sexo' form='datosPersonales' className="form-control">
                                <option>Masculino</option>
                                <option>Femenino</option>
                            </select>
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="direccion" className="form-label">
                                Direccion (Actual)
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                required
                            />
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="fechaNacimiento" className="form-label">
                                Fecha de Nacimiento
                            </label>
                            <input
                                type="date"
                                className="form-control"
                                required
                            />
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="departamento" className="form-label">
                                Departamento (Nacimiento)
                            </label>
                            <select name='departamento' form='datosPersonales' className="form-control">
                                <option>Atlántida</option>
                                <option>Choluteca</option>
                                <option>Colón</option>
                                <option>Comayagua</option>
                                <option>Copán</option>
                                <option>Cortés</option>
                                <option>El Paraíso</option>
                                <option>Francisco Morazán</option>
                                <option>Gracias a Dios</option>
                                <option>Intibucá</option>
                                <option>Islas de la Bahía</option>
                                <option>La Paz</option>
                                <option>Lempira</option>
                                <option>Ocotepeque</option>
                                <option>Olancho</option>
                                <option>Santa Bárbara</option>
                                <option>Valle</option>
                                <option>Yoro</option>
                            </select>
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="municipio" className="form-label">
                                Municipio (Nacimiento)
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                required
                            />
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="aldea" className="form-label">
                                Aldea (Nacimiento)
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                required
                            />
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="caserio" className="form-label">
                                Caserio (Nacimiento)
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                required
                            />
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="telefono" className="form-label">
                                Telefono
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                required
                            />
                        </div>

                    </div>
                </div>
                <button type="submit" className="btn btn-primary">
                    Enviar Formulario
                </button>
            </form>


            {
                showModalDatos && (
                    <div className="modal-overlay">
                        <div className="modal-box">
                            <img src="img/procesado.svg" alt="Exito" className="modal-icon" />
                            <h3 className="modal-title" style={{ textAlign: "center" }}>
                                Exito
                            </h3>
                            <p className="modal-message">
                                El formulario ha sido enviado a la respectiva municipalidad
                                para revision de datos.
                            </p>
                            <button onClick={handleSubmit} className="modal-button">
                                Regresar
                            </button>
                        </div>
                    </div>
                )
            }

        </div >

    );
};

export default RegistrarUsuario;
