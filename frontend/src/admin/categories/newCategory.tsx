import { useState } from "react";
import { mostrarAlerta, mostrarConfirmacion } from "../../alerts/alert";
import { useTranslation } from "../../i18n";

interface formProps {
  onAcept: () => void;
  onCancel: () => void;
  category?: { idcategoria: number; category: string };
}

function FormCategory({ onAcept, onCancel, category }: formProps) {
  const [categoryName, setIdusers] = useState(category?.category ?? "");
  const { t } = useTranslation();
  const esEdicion = Boolean(category);

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

  const editCategory = async () => {
    if (!category || !categoryName.trim()) {
      mostrarAlerta(
        "error",
        "No se pudieron guardar los cambios",
        "Ingrese el nombre de la categoría.",
      );
      return;
    }

    const result = await mostrarConfirmacion(
      "question",
      "¿Deseas guardar los cambios?",
      "Verifica los datos antes de guardar.",
    );

    if (!result.isConfirmed) {
      return;
    }

    const res = await fetch("http://localhost:3000/updateCategory", {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        idcategoria: category.idcategoria,
        categoryName,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      mostrarAlerta("error", "No se pudieron guardar los cambios", data.error);
      return;
    }
    onAcept();

    mostrarAlerta(
      "success",
      "Cambios guardados",
      `La categoría ${categoryName} se actualizó correctamente.`,
    );
  };

  return (
    <div className="formContainer singleFieldForm">
      <p className="listInfo">
        {esEdicion ? t("Editar categoria") : t("Nueva categoria")}
      </p>
      <input
        className="userInput"
        placeholder={t("categoria")}
        type="text"
        value={categoryName}
        onChange={(e) => {
          setIdusers(e.target.value);
        }}
      ></input>

      <section className="buttonsSection">
        <button
          className="optionButton"
          onClick={esEdicion ? editCategory : newUser}
        >
          {esEdicion ? t("Guardar") : t("Crear")}
        </button>
        <button className="optionButton secundary" onClick={onCancel}>
          {t("Cancelar")}
        </button>
      </section>
    </div>
  );
}

export default FormCategory;
