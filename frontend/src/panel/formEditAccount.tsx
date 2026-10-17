import { useState } from "react";
import { motion } from "motion/react";
import { mostrarAlerta, mostrarConfirmacion } from "../alerts/alert";
import apiFetch from "../api";
import { useTranslation } from "../i18n";

interface formProps {
  onAcept: (newCompany: string) => void;
  onCancel: () => void;
  currentIdusers: string;
  companyName: string;
}

function FormEditAccount({
  onAcept,
  onCancel,
  currentIdusers,
  companyName,
}: formProps) {
  const [newIdusers, setNewIdusers] = useState(currentIdusers);
  const [newCompanyName, setNewCompanyName] = useState(companyName);
  const { t } = useTranslation();

  const updateAccount = async () => {
    if (!newIdusers.trim() || !newCompanyName.trim()) {
      mostrarAlerta(
        "error",
        "No se pudo actualizar la cuenta",
        "Complete todos los campos obligatorios.",
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

    const res = await apiFetch("/updateAccount", {
      method: "PUT",
      body: JSON.stringify({
        newIdusers: newIdusers.trim(),
        companyName: newCompanyName.trim(),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      mostrarAlerta("error", "No se pudo actualizar la cuenta", data.error);
      return;
    }

    // El backend emite un token nuevo porque el usuario puede haber
    // cambiado; se guarda antes de refrescar los datos en pantalla.
    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    onAcept(newCompanyName.trim());

    mostrarAlerta(
      "success",
      "Cuenta actualizada",
      "Cuenta actualizada correctamente.",
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
      <p className="listInfo">{t("Datos de la cuenta")}</p>
      <input
        className="userInput"
        placeholder={t("Usuario")}
        type="text"
        maxLength={50}
        value={newIdusers}
        onChange={(e) => setNewIdusers(e.target.value)}
      ></input>
      <input
        className="userInput"
        placeholder={t("Empresa")}
        type="text"
        maxLength={100}
        value={newCompanyName}
        onChange={(e) => setNewCompanyName(e.target.value)}
      ></input>

      <section className="buttonsSection">
        <button className="optionButton" onClick={updateAccount}>
          {t("Guardar cambios")}
        </button>
        <button className="optionButton secundary" onClick={onCancel}>
          {t("Cancelar")}
        </button>
      </section>
    </motion.div>
  );
}

export default FormEditAccount;
