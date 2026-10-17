import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { mostrarAlerta, mostrarConfirmacion } from "../alerts/alert";
import apiFetch from "../api";
import { cerrarSesion } from "../session/session";
import { useTranslation } from "../i18n";

interface formProps {
  onAcept: () => void;
  onCancel: () => void;
}

function FormDeleteAccount({ onCancel }: formProps) {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const deleteAccount = async () => {
    if (!password) {
      mostrarAlerta(
        "error",
        "No se pudo eliminar la cuenta",
        "Confirma tu contraseña para eliminar la cuenta.",
      );
      return;
    }

    const result = await mostrarConfirmacion(
      "warning",
      "¿Deseas eliminar tu cuenta?",
      "Se eliminarán tu inventario, productos, categorías, proveedores y movimientos. Esta acción no se puede deshacer.",
    );

    if (!result.isConfirmed) {
      return;
    }

    const res = await apiFetch("/deleteAccount", {
      method: "DELETE",
      body: JSON.stringify({ password }),
    });

    const data = await res.json();

    if (!res.ok) {
      mostrarAlerta("error", "No se pudo eliminar la cuenta", data.error);
      return;
    }

    cerrarSesion(navigate);

    mostrarAlerta("success", "Cuenta eliminada", data.message);
  };

  return (
    <motion.div
      className="formContainer singleFieldForm"
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.97 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      <p className="listInfo">{t("Eliminar cuenta")}</p>
      <p className="listInfo">
        {t(
          "Confirma tu contraseña para eliminar la cuenta y todo su inventario.",
        )}
      </p>
      <input
        className="userInput"
        placeholder={t("contraseña")}
        type="password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      ></input>

      <section className="buttonsSection">
        <button className="optionButton dangerButton" onClick={deleteAccount}>
          {t("Eliminar cuenta")}
        </button>
        <button className="optionButton secundary" onClick={onCancel}>
          {t("Cancelar")}
        </button>
      </section>
    </motion.div>
  );
}

export default FormDeleteAccount;
