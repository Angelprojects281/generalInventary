import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { RotateCcw, ShieldCheck } from "lucide-react";
import { mostrarAlerta } from "../alerts/alert";
import apiFetch from "../api";
import { useTranslation } from "../i18n";
import useCooldown from "./useCooldown";

interface formProps {
  idusers: string;
  email: string;
  onCancel: () => void;
}

function FormVerify({ idusers, email: emailInicial, onCancel }: formProps) {
  const [email, setEmail] = useState(emailInicial);
  const [code, setCode] = useState("");
  // Con correo (registro recien creado) el codigo acaba de emitirse: el
  // reenvio arranca bloqueado 60 s. Sin correo (cuenta sin verificar al
  // volver) no hay nada que esperar.
  const [cooldown, reiniciarCooldown] = useCooldown(emailInicial ? 60 : 0);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleVerify = async () => {
    if (!/^\d{6}$/.test(code)) {
      mostrarAlerta(
        "error",
        "No se pudo verificar la cuenta",
        "El código debe tener 6 dígitos.",
      );
      return;
    }

    const res = await apiFetch("/verifyAccount", {
      method: "POST",
      body: JSON.stringify({ idusers, code }),
    });

    const data = await res.json();

    if (!res.ok) {
      mostrarAlerta("error", "No se pudo verificar la cuenta", data.error);
      return;
    }

    // Auto-login: el codigo correcto devuelve el token de sesion.
    localStorage.setItem("token", data.token);
    navigate("/panel");
  };

  const handleResend = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      mostrarAlerta(
        "error",
        "No se pudo enviar el código",
        "Ingrese un correo electrónico válido.",
      );
      return;
    }

    const res = await apiFetch("/requestVerificationCode", {
      method: "POST",
      body: JSON.stringify({ idusers, email }),
    });

    const data = await res.json();

    if (!res.ok) {
      mostrarAlerta("error", "No se pudo enviar el código", data.error);
      return;
    }

    reiniciarCooldown();
    mostrarAlerta("success", "Solicitud enviada", data.message);
  };

  return (
    <motion.div
      className="formContainer singleFieldForm"
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.97 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      <p className="listInfo">{t("Verifica tu cuenta")}</p>
      {emailInicial ? (
        <p className="listInfo">
          {t("Hemos enviado un código de 6 dígitos a")} {emailInicial}
        </p>
      ) : (
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
      )}
      <p className="listInfo">{t("El código caduca a los 15 minutos.")}</p>
      <input
        className="userInput codeInput"
        placeholder={t("código de verificación")}
        type="text"
        inputMode="numeric"
        maxLength={6}
        value={code}
        onChange={(e) => {
          setCode(e.target.value);
        }}
      ></input>

      <section className="buttonsSection">
        <button className="optionButton" onClick={handleVerify}>
          <ShieldCheck size={18} aria-hidden="true" />
          {t("VERIFICAR")}
        </button>
        <button
          className="optionButton secundary"
          onClick={handleResend}
          disabled={cooldown > 0}
        >
          <RotateCcw size={18} aria-hidden="true" />
          {t("Reenviar código")}
          {cooldown > 0 ? ` (${cooldown}s)` : ""}
        </button>
        <button className="optionButton secundary" onClick={onCancel}>
          {t("Cancelar")}
        </button>
      </section>
    </motion.div>
  );
}

export default FormVerify;
