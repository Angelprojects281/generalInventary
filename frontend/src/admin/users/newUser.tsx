import { useState } from "react";
import { mostrarAlerta } from "../../alerts/alert";

interface formProps {
  onAcept: () => void;
  onCancel: () => void;
}

function FormUsers({ onAcept, onCancel }: formProps) {
  const [idusers, setIdusers] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("");

  const newUser = async () => {
    const res = await fetch("http://localhost:3000/newUser", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        idusers,
        password,
        rol,
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
      "Usuario creado correctamente",
      `Se creo el usuario ${idusers} con el rol ${rol}`,
    );
  };

  return (
    <div className="formContainer">
      <p className="tittle">Nuevo usuario</p>
      <input
        className="userInput"
        placeholder="usuario"
        type="text"
        onChange={(e) => {
          setIdusers(e.target.value);
        }}
      ></input>
      <input
        className="userInput"
        placeholder="contraseña"
        type="password"
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      ></input>
      <select
        className="userInput"
        onChange={(e) => {
          setRol(e.target.value);
        }}
      >
        <option value="">seleccione un rol</option>
        <option value="admin">administrador</option>
        <option value="regular">regular</option>
      </select>

      <section className="buttonsSection">
        <button className="optionButton" onClick={newUser}>
          Crear
        </button>
        <button className="optionButton secundary" onClick={onCancel}>
          Cancelar
        </button>
      </section>
    </div>
  );
}

export default FormUsers;
