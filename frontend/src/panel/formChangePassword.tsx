import { useState } from "react";
import { motion } from "motion/react";
import { mostrarAlerta } from "../alerts/alert";
import apiFetch from "../api";
import { useTranslation } from "../i18n";

interface formProps {
  onAcept: () => void;
  onCancel: () => void;
}

function FormChangePassword({ onAcept, onCancel }: formProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { t } = useTranslation();

  const changePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      mostrarAlerta(
        "error",
        "No se pudo cambiar la contraseña",
        "Complete todos los campos obligatorios.",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      mostrarAlerta(
        "error",
        "No se pudo cambiar la contraseña",
        "Las contraseñas no coinciden.",
      );
      return;
    }

    const res = await apiFetch("/changePassword", {
      method: "POST",
      body: JSON.stringify({
        currentPassword,
        newPassword,
        confirmPassword,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      mostrarAlerta("error", "No se pudo cambiar la contraseña", data.error);
      return;
    }
    onAcept();

    mostrarAlerta(
      "success",
      "Contraseña actualizada",
      "Contraseña actualizada correctamente.",
    );
  };

  return (
    <motion.div
      className="formContainer"
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.97 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      <p className="listInfo">{t("Cambiar contraseña")}</p>
      <input
        className="userInput"
        placeholder={t("Contraseña actual")}
        type="password"
        value={currentPassword}
        onChange={(e) => {
          setCurrentPassword(e.target.value);
        }}
      ></input>
      <input
        className="userInput"
        placeholder={t("contraseña nueva")}
        type="password"
        value={newPassword}
        onChange={(e) => {
          setNewPassword(e.target.value);
        }}
      ></input>
      <input
        className="userInput"
        placeholder={t("confirmar contraseña")}
        type="password"
        value={confirmPassword}
        onChange={(e) => {
          setConfirmPassword(e.target.value);
        }}
      ></input>

      <section className="buttonsSection">
        <button className="optionButton" onClick={changePassword}>
          {t("Cambiar contraseña")}
        </button>
        <button className="optionButton secundary" onClick={onCancel}>
          {t("Cancelar")}
        </button>
      </section>
    </motion.div>
  );
}

export default FormChangePassword;
