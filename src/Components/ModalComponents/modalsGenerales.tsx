import "../../style/ModalesStyles/PageModal/modalsGeneralesStyle.css"

//Interface en donde ira la parte de los formularios de las modales de avisos
interface AdvertenciaProps {
    icono: string;
    titulo: string;
    mensaje: string | React.ReactNode;
    descripcion?: string;
    textoBoton?: string;
    onConfirmar: () => void;
    children?: React.ReactNode;
}

//Funcion en donde se puedan agregar las modales de avisos
export default function Advertencia({ icono, titulo, mensaje, textoBoton, onConfirmar , children}: AdvertenciaProps) {
  return (
    <>
    <div className="modal-overlay">
        <div className="advertencias-container">
        {icono && <img src={icono} className="modal-icon" alt="icono" />}
        <h3 className="modal-title">{titulo}</h3>
        <p className="modal-message">{mensaje}</p>
        <button className="modal-button"onClick={onConfirmar}>{textoBoton}</button>
        {children}
        </div>
    </div>
    </>
  );
}

//Funcion en donde se visualizara la modal de comisison por pago con tarjeta
