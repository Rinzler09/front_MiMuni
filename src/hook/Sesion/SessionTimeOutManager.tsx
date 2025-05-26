// import React from "react";
// import Modal from "../../Components/attributeComponents/ModalComponents/modalComponent";
// import { useSessionTimeout } from "../UseSessionTimeout";

// interface Props {
//   onContinue: () => void; // cuando el usuario pulsa “Continuar trabajando”
//   onLogout: () => void;   // cuando expira la sesión
// }

// export const SessionTimeoutManager: React.FC<Props> = ({ onContinue, onLogout }) => {
//   const { showModal, showExpiredModal, countdown, resetTimers } =
//     useSessionTimeout({ onExpire: onLogout });

//   return (
//     <>
//       {/* Warning */}
//       <Modal isVisible={showModal} title="Información de sesión" showCloseButton={false}>
//         <div style={{ textAlign: 'center', marginTop: '1rem' }}>
//           <p>
//             Su sesión caducará en <strong>{countdown}</strong> segundo{countdown !== 1 ? 's' : ''}.
//           </p>
//           <button
//             className="modal-button"
//             onClick={() => {
//               resetTimers();
//               onContinue();
//             }}
//           >
//             Continuar
//           </button>
//         </div>
//       </Modal>

//       {/* Expired */}
//       <Modal
//         isVisible={showExpiredModal}
//         title="La sesión ha caducado"
//         message="Su sesión ha caducado. Inicie sesión de nuevo."
//         showCloseButton={false}
//       >
//         <div style={{ textAlign: "center", marginTop: "1rem" }}>
//           <button className="modal-button" onClick={onLogout}>
//             Iniciar sesión
//           </button>
//         </div>
//       </Modal>
//     </>
//   );
// };
