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
    if (newPassword !== confirmPassword) {
      mostrarAlerta(
        "error",
        "Error al cambiar contraseña",
        "Las contraseñas no coinciden",
      );
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
      mostrarAlerta("error", "error al crear usuario", data.error);
      return;
    }
    onAcept();

    mostrarAlerta(
      "success",
      "Contraseña cambiada correctamente",
      `Se cambio la contraseña para el usuario ${idusers}`,
    );
  };

  return (
    <div className="formContainer">
      <p className="tittle">
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
