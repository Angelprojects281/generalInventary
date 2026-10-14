import { useState } from "react";
import { mostrarAlerta } from "../../alerts/alert";
import { useTranslation } from "../../i18n";

interface formProps {
  onAcept: () => void;
  onCancel: () => void;
  idUsuario: string;
}

function FormUpdate({ onAcept, onCancel, idUsuario }: formProps) {
  const idusers = idUsuario;
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { t } = useTranslation();

  const newUser = async () => {
    if (!newPassword || !confirmPassword) {
      mostrarAlerta(
        "error",
        "No se pudo cambiar la contraseña",
        "Complete ambos campos.",
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

    const res = await fetch("http://localhost:3000/changePassword", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        idusers,
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
      `La contraseña del usuario ${idusers} se actualizó correctamente.`,
    );
  };

  return (
    <div className="formContainer">
      <p className="listInfo">
        {t("Actualizando contraseña para el usuario")} {idUsuario}
      </p>
      <input
        className="userInput"
        placeholder={t("contraseña nueva")}
        type="password"
        onChange={(e) => {
          setNewPassword(e.target.value);
        }}
      ></input>
      <input
        className="userInput"
        placeholder={t("confirmar contraseña")}
        type="password"
        onChange={(e) => {
          setConfirmPassword(e.target.value);
        }}
      ></input>

      <section className="buttonsSection">
        <button className="optionButton" onClick={newUser}>
          {t("Cambiar contraseña")}
        </button>
        <button className="optionButton secundary" onClick={onCancel}>
          {t("Cancelar")}
        </button>
      </section>
    </div>
  );
}

export default FormUpdate;
