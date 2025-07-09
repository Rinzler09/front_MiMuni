// src/components/attributeComponents/ModalComponents/modalComponent.tsx
import React from 'react';
import "../../style/ModalesStyles/PageModal/modalConfir.css";

interface ModalProps {
  isVisible: boolean;
  title?: string;
  message?: string;
  onClose?: () => void;
  children?: React.ReactNode;
  showCloseButton?: boolean;
  closeButtonLabel?: string;
  iconSrc?: string;
  iconAlt?: string;
}

const Modal: React.FC<ModalProps> = ({
  isVisible,
  title,
  message,
  onClose,
  children,
  showCloseButton = true,
  closeButtonLabel = "Regresar",
  iconSrc = "img/advertencia.png",
  iconAlt,
}) => {
  if (!isVisible) return null;

  // Este handler detiene TODO evento dentro de la modal
  const stop = (e: React.SyntheticEvent) => {
    e.stopPropagation();
  };

  const altText = iconAlt || "icono";

  return (
    <div
      className="modal-overlay"
      // aquí detenemos ratón, teclado, scroll…
      onMouseDown={stop}
      onMouseMove={stop}
      onKeyDown={stop}
      onTouchStart={stop}
      onScroll={stop}
    >
      <div
        className="modal-box"
        onMouseDown={stop}
        onMouseMove={stop}
        onKeyDown={stop}
        onTouchStart={stop}
        onScroll={stop}
      >
        <img src={iconSrc} alt={altText} className='modal-icon' />
        {title && <h3 className="modal-title" style={{ textAlign: "center" }}>{title}</h3>}
        {message && <p className="modal-message">{message}</p>}
        {children}
        {showCloseButton && onClose && (
          <button className="modal-button" onClick={onClose}>
            {closeButtonLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default Modal;


