import { useState } from "react";
import { mostrarAlerta } from "../../alerts/alert";

interface FormProps {
  onAcept: () => void;
  onCancel: () => void;
}

function FormProvider({ onAcept, onCancel }: FormProps) {
  const [providerName, setProviderName] = useState("");
  const [contact, setContact] = useState("");

  const createProvider = async () => {
    const normalizedName = providerName.trim();
    const parsedContact = Number(contact);

    if (
      !normalizedName ||
      !contact ||
      !Number.isInteger(parsedContact) ||
      parsedContact <= 0
    ) {
      mostrarAlerta(
        "error",
        "No se pudo crear el proveedor",
        "Ingresa el nombre y un contacto numérico válido.",
      );
      return;
    }

    const res = await fetch("http://localhost:3000/newProvider", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        provider_name: normalizedName,
        contact: parsedContact,
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      mostrarAlerta("error", "No se pudo crear el proveedor", data.error);
      return;
    }

    onAcept();
    mostrarAlerta(
      "success",
      "Proveedor creado",
      `El proveedor ${normalizedName} se creó correctamente.`,
    );
  };

  return (
    <div className="formContainer">
      <p className="listInfo">Nuevo proveedor</p>
      <input
        className="userInput"
        placeholder="proveedor"
        type="text"
        value={providerName}
        onChange={(e) => setProviderName(e.target.value)}
      />
      <input
        className="userInput"
        placeholder="contacto"
        type="number"
        min="1"
        step="1"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
      />
      <section className="buttonsSection">
        <button className="optionButton" onClick={createProvider}>
          Crear
        </button>
        <button className="optionButton secundary" onClick={onCancel}>
          Cancelar
        </button>
      </section>
    </div>
  );
}

export default FormProvider;
