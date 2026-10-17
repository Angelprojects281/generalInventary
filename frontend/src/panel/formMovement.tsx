import { useState } from "react";
import { motion } from "motion/react";
import { mostrarAlerta } from "../alerts/alert";
import apiFetch from "../api";
import { useTranslation } from "../i18n";

interface formProps {
  onAcept: () => void;
  onCancel: () => void;
  category_name: string;
  product_name: string;
}

function FormMovement({
  onAcept,
  onCancel,
  category_name,
  product_name,
}: formProps) {
  const [type, setType] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const { t } = useTranslation();

  const newMovement = async () => {
    if (!amount || !type) {
      mostrarAlerta(
        "error",
        "No se pudo registrar el movimiento",
        "Ingrese una cantidad y seleccione el tipo de movimiento.",
      );
      return;
    }
    const res = await apiFetch("/newMovement", {
      method: "POST",
      body: JSON.stringify({
        type,
        amount,
        category_name,
        product_name,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      mostrarAlerta("error", "No se pudo registrar el movimiento", data.error);
      return;
    }
    onAcept();

    mostrarAlerta(
      "success",
      "Movimiento registrado",
      `El movimiento se registró correctamente.`,
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
      <p className="listInfo">
        {t("Nuevo Movimiento para el producto")} {product_name}
      </p>
      <input
        className="userInput"
        placeholder={t("cantidad")}
        type="number"
        onChange={(e) => {
          setAmount(Number(e.target.value));
        }}
      ></input>

      <select className="userInput" onChange={(e) => setType(e.target.value)}>
        <option value="">{t("seleccione el tipo:")}</option>
        <option value="entrada">{t("Entrada")}</option>
        <option value="salida">{t("Salida")}</option>
      </select>

      <section className="buttonsSection">
        <button className="optionButton" onClick={newMovement}>
          {t("Crear")}
        </button>
        <button className="optionButton secundary" onClick={onCancel}>
          {t("Cancelar")}
        </button>
      </section>
    </motion.div>
  );
}

export default FormMovement;
