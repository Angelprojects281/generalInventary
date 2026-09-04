import { useState } from "react";
import { mostrarAlerta } from "../../alerts/alert";

interface formProps {
  onAcept: () => void;
  onCancel: () => void;
}

function FormCategory({ onAcept, onCancel }: formProps) {
  const [categoryName, setIdusers] = useState("");

  const newUser = async () => {
    const res = await fetch("http://localhost:3000/newCategory", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        categoryName,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      mostrarAlerta("error", "error al crear categoria", data.error);
      return;
    }
    onAcept();

    mostrarAlerta(
      "success",
      "categoria creada",
      `Se creo la categoria ${categoryName} correctamente`,
    );
  };

  return (
    <div className="formContainer">
      <p className="tittle">Nueva categoria</p>
      <input
        className="userInput"
        placeholder="categoria"
        type="text"
        onChange={(e) => {
          setIdusers(e.target.value);
        }}
      ></input>

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

export default FormCategory;
