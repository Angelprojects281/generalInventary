import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { mostrarAlerta } from "../alerts/alert";
import apiFetch from "../api";
import { useTranslation } from "../i18n";

interface formProps {
  onCancel: () => void;
}

function FormRegister({ onCancel }: formProps) {
  const [idusers, setIdusers] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleRegister = async () => {
    if (!idusers || !companyName || !password || !confirmPassword) {
      mostrarAlerta(
        "error",
        "No se pudo crear la cuenta",
        "Complete todos los campos obligatorios.",
      );
      return;
    }

    if (password !== confirmPassword) {
      mostrarAlerta(
        "error",
        "No se pudo crear la cuenta",
        "Las contraseñas no coinciden.",
      );
      return;
    }

    const res = await apiFetch("/register", {
      method: "POST",
      body: JSON.stringify({ idusers, companyName, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      mostrarAlerta("error", "No se pudo crear la cuenta", data.error);
      return;
    }

    localStorage.setItem("token", data.token);
    navigate("/panel");
  };

  return (
    <motion.div
      className="formContainer singleFieldForm"
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.97 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      <p className="listInfo">{t("Crear una cuenta")}</p>
      <input
        className="userInput"
        placeholder={t("usuario")}
        type="text"
        maxLength={50}
        value={idusers}
        onChange={(e) => {
          setIdusers(e.target.value);
        }}
      ></input>
      <input
        className="userInput"
        placeholder={t("nombre de la empresa")}
        type="text"
        maxLength={100}
        value={companyName}
        onChange={(e) => {
          setCompanyName(e.target.value);
        }}
      ></input>
      <input
        className="userInput"
        placeholder={t("contraseña")}
        type="password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
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
        <button className="optionButton" onClick={handleRegister}>
          <UserPlus size={18} aria-hidden="true" />
          {t("CREAR CUENTA")}
        </button>
        <button className="optionButton secundary" onClick={onCancel}>
          {t("Cancelar")}
        </button>
      </section>
    </motion.div>
  );
}

export default FormRegister;
