import React from 'react'
import Municipalidad from '../ImagesComponents/Municipalidad.tsx';
import '../../style/ErrorStyles/notFound.css';

const NotFound: React.FC = () => {

    return (
        <div className='notFound-container'>
            <Municipalidad />< br />
            <h1>Error 404</h1>
            <p><strong>No encontrado</strong></p>
            <p>El recurso socilitado no se pudo encontrar, por favor navegue a la pagina anterior.</p>
        </div>
    );
}

export default NotFound;