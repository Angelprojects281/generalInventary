import { useState } from "react";
import { motion } from "motion/react";
import { Send } from "lucide-react";
import { mostrarAlerta } from "../alerts/alert";
import apiFetch from "../api";
import { useTranslation } from "../i18n";

interface formProps {
  onCancel: () => void;
  onSent: (email: string) => void;
}

function FormForgotPassword({ onCancel, onSent }: formProps) {
  const [email, setEmail] = useState("");
  const { t } = useTranslation();

  const handleSend = async () => {
    if (!email) {
      mostrarAlerta(
        "error",
        "No se pudo enviar el código",
        "Complete todos los campos obligatorios.",
      );
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      mostrarAlerta(
        "error",
        "No se pudo enviar el código",
        "Ingrese un correo electrónico válido.",
      );
      return;
    }

    const res = await apiFetch("/requestPasswordReset", {
      method: "POST",
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
      mostrarAlerta("error", "No se pudo enviar el código", data.error);
      return;
    }

    mostrarAlerta("success", "Solicitud enviada", data.message);
    onSent(email);
  };

  return (
    <motion.div
      className="formContainer singleFieldForm"
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.97 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      <p className="listInfo">{t("Recupera tu contraseña")}</p>
      <input
        className="userInput"
        placeholder={t("correo electrónico")}
        type="email"
        maxLength={255}
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      ></input>

      <section className="buttonsSection">
        <button className="optionButton" onClick={handleSend}>
          <Send size={18} aria-hidden="true" />
          {t("ENVIAR CÓDIGO")}
        </button>
        <button className="optionButton secundary" onClick={onCancel}>
          {t("Cancelar")}
        </button>
      </section>
    </motion.div>
  );
}

export default FormForgotPassword;
