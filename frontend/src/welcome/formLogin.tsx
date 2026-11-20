import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { mostrarAlerta } from "../alerts/alert";
import apiFetch from "../api";
import { useTranslation } from "../i18n";

interface formProps {
  onCancel: () => void;
  onUnverified: (idusers: string) => void;
  onForgot: () => void;
}

function FormLogin({ onCancel, onUnverified, onForgot }: formProps) {
  const [idusers, setIdusers] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogin = async () => {
    if (!idusers || !password) {
      mostrarAlerta(
        "error",
        "No se pudo iniciar sesión",
        "Ingrese su usuario y contraseña.",
      );
      return;
    }

    const res = await apiFetch("/logIn", {
      method: "POST",
      body: JSON.stringify({ idusers, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      // El 403 (cuenta sin verificar) no lo intercepta apiFetch: se
      // detecta aqui y se abre la pantalla de verificacion con el
      // usuario escrito (el correo se pide en ese formulario).
      if (res.status === 403) {
        mostrarAlerta("error", "Cuenta no verificada", data.error);
        onUnverified(idusers);
        return;
      }

      mostrarAlerta("error", "No se pudo iniciar sesión", data.error);
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
      <p className="listInfo">{t("Iniciar sesión")}</p>
      <input
        className="userInput"
        placeholder={t("usuario")}
        type="text"
        value={idusers}
        onChange={(e) => {
          setIdusers(e.target.value);
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

      <button className="formLink" onClick={onForgot}>
        {t("¿Olvidaste tu contraseña?")}
      </button>

      <section className="buttonsSection">
        <button className="optionButton" onClick={handleLogin}>
          <LogIn size={18} aria-hidden="true" />
          {t("INICIAR SESION")}
        </button>
        <button className="optionButton secundary" onClick={onCancel}>
          {t("Cancelar")}
        </button>
      </section>
    </motion.div>
  );
}

export default FormLogin;
