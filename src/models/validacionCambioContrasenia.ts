// models/validacionCambioContrasenia.ts
import { useState } from "react";

export type ActiveTab =
  | "informacion"
  | "contraseña"
  | "notificaciones"
  | "tarjetas";
export type ShowPasswordState = {
  oldPassword: boolean;
  newPassword: boolean;
  confirmPassword: boolean;
};

export const useEditarPerfilLogic = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("contraseña");
  const [showPassword, setShowPassword] = useState<ShowPasswordState>({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [isModalVisible, setModalVisible] = useState(false);

  const handleTabClick = (tab: ActiveTab) => {
    setActiveTab(tab);
  };

  const togglePasswordVisibility = (field: keyof ShowPasswordState) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSavePassword = () => {
    // Aquí iría la lógica para guardar la contraseña.
    setModalVisible(true); // Muestra el modal.
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return {
    activeTab,
    handleTabClick,
    showPassword,
    togglePasswordVisibility,
    isModalVisible,
    handleSavePassword,
    closeModal,
  };
};
