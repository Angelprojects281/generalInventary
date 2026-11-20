import { useState } from "react";
import { motion } from "motion/react";
import { KeyRound, RotateCcw } from "lucide-react";
import { mostrarAlerta } from "../alerts/alert";
import apiFetch from "../api";
import { useTranslation } from "../i18n";
import useCooldown from "./useCooldown";

interface formProps {
  email: string;
  onCancel: () => void;
  onReset: () => void;
}

function FormResetPassword({ email: emailInicial, onCancel, onReset }: formProps) {
  const [email, setEmail] = useState(emailInicial);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // El codigo acaba de emitirse en el paso anterior: el reenvio arranca
  // bloqueado 60 segundos.
  const [cooldown, reiniciarCooldown] = useCooldown(60);
  const { t } = useTranslation();

  const handleReset = async () => {
    if (!email || !code || !newPassword || !confirmPassword) {
      mostrarAlerta(
        "error",
        "No se pudo restablecer la contraseña",
        "Complete todos los campos obligatorios.",
      );
      return;
    }

    if (!/^\d{6}$/.test(code)) {
      mostrarAlerta(
        "error",
        "No se pudo restablecer la contraseña",
        "El código debe tener 6 dígitos.",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      mostrarAlerta(
        "error",
        "No se pudo restablecer la contraseña",
        "Las contraseñas no coinciden.",
      );
      return;
    }

    const res = await apiFetch("/resetPassword", {
      method: "POST",
      body: JSON.stringify({ email, code, newPassword, confirmPassword }),
    });

    const data = await res.json();

    if (!res.ok) {
      mostrarAlerta(
        "error",
        "No se pudo restablecer la contraseña",
        data.error,
      );
      return;
    }

    mostrarAlerta(
      "success",
      "Contraseña actualizada",
      "Contraseña actualizada correctamente.",
    );
    onReset();
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

    const res = await apiFetch("/requestPasswordReset", {
      method: "POST",
      body: JSON.stringify({ email }),
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
      <p className="listInfo">{t("Restablecer contraseña")}</p>
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
      <input
        className="userInput"
        placeholder={t("contraseña nueva")}
        type="password"
        value={newPassword}
        onChange={(e) => {
          setNewPassword(e.target.value);
        }}
      ></input>
      <input
        className="userInput"
        placeholder={t("confirmar contraseña")}
        type="password"
        value={confirmPassword}
        onChange={(e) => {
          setConfirmPassword(e.target.value);
        }}
      ></input>

      <section className="buttonsSection">
        <button className="optionButton" onClick={handleReset}>
          <KeyRound size={18} aria-hidden="true" />
          {t("RESTABLECER CONTRASEÑA")}
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

export default FormResetPassword;
