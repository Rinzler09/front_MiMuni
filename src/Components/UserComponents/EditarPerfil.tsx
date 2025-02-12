import React from "react";
import "../../style/editar.css";
import {
  useEditarPerfilLogic,
  ActiveTab,
  ShowPasswordState,
} from "../../models/validacionCambioContrasenia";
import TarjetasGuardadas from "../TarjetasComponents/TarjetasGuardadas";

const EditarPerfil: React.FC = () => {
  const { activeTab, handleTabClick, showPassword, togglePasswordVisibility } =
    useEditarPerfilLogic();

  return (
    <div className="editar-perfil-container">
      <h2 className="perfil-title">Mi Perfil</h2>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === "informacion" ? "active" : ""}`}
          onClick={() => handleTabClick("informacion")}
        >
          <i className="fa fa-user"></i> MI INFORMACIÓN
        </button>
        <button
          className={`tab ${activeTab === "contraseña" ? "active" : ""}`}
          onClick={() => handleTabClick("contraseña")}
        >
          <i className="fa fa-key"></i> CONTRASEÑA
        </button>
        <button
          className={`tab ${activeTab === "notificaciones" ? "active" : ""}`}
          onClick={() => handleTabClick("notificaciones")}
        >
          <i className="fa fa-bell"></i> NOTIFICACIONES
        </button>
        <button
          className={`tab ${activeTab === "tarjetas" ? "active" : ""}`}
          onClick={() => handleTabClick("tarjetas")}
        >
          <i className="fa fa-credit-card"></i> MIS TARJETAS
        </button>
      </div>

      {/* Contenido */}
      <div className="tab-content1">
        {activeTab === "informacion" && (
          <div>
            <h3>Mi Información</h3>
            <p>Sección en construcción...</p>
          </div>
        )}

        {activeTab === "contraseña" && (
          <div>
            <h3>Cambiar contraseña</h3>
            <p>
              Llena los siguientes campos para proceder con el cambio de
              contraseña:
            </p>
            <form>
              {["oldPassword", "newPassword", "confirmPassword"].map(
                (field) => (
                  <div className="form-group" key={field}>
                    <label>
                      {field === "oldPassword"
                        ? "Contraseña Anterior"
                        : field === "newPassword"
                          ? "Contraseña Nueva"
                          : "Repetir Contraseña Nueva"}
                    </label>
                    <div className="input-icon">
                      <input
                        type={
                          showPassword[field as keyof ShowPasswordState]
                            ? "text"
                            : "password"
                        }
                        placeholder={
                          field === "oldPassword"
                            ? "Contraseña Anterior"
                            : field === "newPassword"
                              ? "Contraseña Nueva"
                              : "Repetir Contraseña Nueva"
                        }
                      />
                      <i
                        className={`fa ${showPassword[field as keyof ShowPasswordState]
                          ? "fa-eye-slash"
                          : "fa-eye"
                          }`}
                        onClick={() =>
                          togglePasswordVisibility(
                            field as keyof ShowPasswordState
                          )
                        }
                      ></i>
                    </div>
                  </div>
                )
              )}
              <ul className="password-requirements">
                <li>✔ Al menos 8 caracteres.</li>
                <li>✔ Máximo 20 caracteres.</li>
                <li>✔ Debe contener al menos una letra mayúscula.</li>
                <li>✔ Debe contener al menos un número.</li>
                <li>
                  ✔ Debe contener al menos un carácter especial (!@#$%^&*).
                </li>
              </ul>
              <button type="submit" className="btn-submit">
                CAMBIAR
              </button>
            </form>
          </div>
        )}

        {activeTab === "notificaciones" && (
          <div>
            <h3>Notificaciones</h3>
            <p>Sección en construcción...</p>
          </div>
        )}


        {activeTab === "tarjetas" && (

          <div className="tab-content2">

            {/* <h3>Mis Tarjetas</h3>
            <p>Aquí puedes gestionar tus tarjetas vinculadas a tu perfil.</p> */}
            <TarjetasGuardadas />

          </div>
        )}
      </div>
    </div>
  );
};

export default EditarPerfil;
