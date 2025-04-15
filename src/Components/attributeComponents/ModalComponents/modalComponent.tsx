import React from 'react';
import "../../../style/ModalesStyles/PageModal/modalConfir.css";

interface ModalProps {
  isVisible: boolean;
  title?: string;
  message?: string;
  onClose: () => void;
  children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isVisible, title, message, onClose, children }) => {
  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
      <img src="img/procesado.svg" alt="Exito" className="modal-icon" />
        {title && <h3 className="modal-title" style={{ textAlign: "center" }}>{title}</h3>}
        {message && <p className="modal-message">{message}</p>}
        {children}
        <button className="modal-button" onClick={onClose}>
          Regresar
        </button>
      </div>
    </div>
  );
};

export default Modal;
