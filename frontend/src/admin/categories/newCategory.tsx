import { useState } from "react";
import { mostrarAlerta } from "../../alerts/alert";
import { useTranslation } from "../../i18n";

interface formProps {
  onAcept: () => void;
  onCancel: () => void;
}

function FormCategory({ onAcept, onCancel }: formProps) {
  const [categoryName, setIdusers] = useState("");
  const { t } = useTranslation();

  const newUser = async () => {
    if (!categoryName.trim()) {
      mostrarAlerta(
        "error",
        "No se pudo crear la categoría",
        "Ingrese el nombre de la categoría.",
      );
      return;
    }

    const res = await fetch("http://localhost:3000/newCategory", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        categoryName,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      mostrarAlerta("error", "No se pudo crear la categoría", data.error);
      return;
    }
    onAcept();

    mostrarAlerta(
      "success",
      "Categoría creada",
      `La categoría ${categoryName} se creó correctamente.`,
    );
  };

  return (
    <div className="formContainer singleFieldForm">
      <p className="listInfo">{t("Nueva categoria")}</p>
      <input
        className="userInput"
        placeholder={t("categoria")}
        type="text"
        onChange={(e) => {
          setIdusers(e.target.value);
        }}
      ></input>

      <section className="buttonsSection">
        <button className="optionButton" onClick={newUser}>
          {t("Crear")}
        </button>
        <button className="optionButton secundary" onClick={onCancel}>
          {t("Cancelar")}
        </button>
      </section>
    </div>
  );
}

export default FormCategory;
