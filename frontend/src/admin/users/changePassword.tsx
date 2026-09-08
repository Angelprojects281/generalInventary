import { useState } from "react";
import { mostrarAlerta } from "../../alerts/alert";

interface formProps {
  onAcept: () => void;
  onCancel: () => void;
  idUsuario: string;
}

function FormUpdate({ onAcept, onCancel, idUsuario }: formProps) {
  const idusers = idUsuario;
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const newUser = async () => {
    if (!newPassword || !confirmPassword) {
      mostrarAlerta(
        "error",
        "No se pudo cambiar la contraseña",
        "Completa ambos campos antes de continuar.",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      mostrarAlerta(
        "error",
        "No se pudo cambiar la contraseña",
        "Las contraseñas no coinciden. Verifica la información.",
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
        Actualizando contraseña para el usuario {idUsuario}
      </p>
      <input
        className="userInput"
        placeholder="contraseña nueva"
        type="password"
        onChange={(e) => {
          setNewPassword(e.target.value);
        }}
      ></input>
      <input
        className="userInput"
        placeholder="confirmar contraseña"
        type="password"
        onChange={(e) => {
          setConfirmPassword(e.target.value);
        }}
      ></input>

      <section className="buttonsSection">
        <button className="optionButton" onClick={newUser}>
          Cambiar contraseña
        </button>
        <button className="optionButton secundary" onClick={onCancel}>
          Cancelar
        </button>
      </section>
    </div>
  );
}

export default FormUpdate;
