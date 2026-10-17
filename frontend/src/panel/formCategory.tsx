import { useState } from "react";
import { motion } from "motion/react";
import { mostrarAlerta, mostrarConfirmacion } from "../alerts/alert";
import apiFetch from "../api";
import { useTranslation } from "../i18n";

interface formProps {
  onAcept: () => void;
  onCancel: () => void;
  category?: { idcategoria: number; category: string };
}

function FormCategory({ onAcept, onCancel, category }: formProps) {
  const [categoryName, setCategoryName] = useState(category?.category ?? "");
  const { t } = useTranslation();
  const esEdicion = Boolean(category);

  const createCategory = async () => {
    if (!categoryName.trim()) {
      mostrarAlerta(
        "error",
        "No se pudo crear la categoría",
        "Ingrese el nombre de la categoría.",
      );
      return;
    }

    const res = await apiFetch("/newCategory", {
      method: "POST",
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

    const res = await apiFetch("/updateCategory", {
      method: "PUT",
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
    <motion.div
      className="formContainer singleFieldForm"
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.97 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      <p className="listInfo">
        {esEdicion ? t("Editar categoria") : t("Nueva categoria")}
      </p>
      <input
        className="userInput"
        placeholder={t("categoria")}
        type="text"
        value={categoryName}
        onChange={(e) => {
          setCategoryName(e.target.value);
        }}
      ></input>

      <section className="buttonsSection">
        <button
          className="optionButton"
          onClick={esEdicion ? editCategory : createCategory}
        >
          {esEdicion ? t("Guardar") : t("Crear")}
        </button>
        <button className="optionButton secundary" onClick={onCancel}>
          {t("Cancelar")}
        </button>
      </section>
    </motion.div>
  );
}

export default FormCategory;
