import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import { KeyRound, LogOut, Pencil, Trash2 } from "lucide-react";
import { mostrarAlerta } from "../alerts/alert";
import apiFetch from "../api";
import { confirmarCierreSesion } from "../session/session";
import FormEditAccount from "./formEditAccount";
import FormChangePassword from "./formChangePassword";
import FormDeleteAccount from "./formDeleteAccount";
import { useTranslation } from "../i18n";

type accountForm = "none" | "edit" | "password" | "delete";

export default function AccountScreen() {
  const [idusers, setIdusers] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [activeForm, setActiveForm] = useState<accountForm>("none");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const fetchAccount = async () => {
    const res = await apiFetch("/accountInfo");

    const data = await res.json();

    if (!res.ok) {
      mostrarAlerta("error", "No se pudo cargar la cuenta", data.error);
      return;
    }

    setIdusers(data.idusers);
    setCompanyName(data.companyName);
  };

  // La carga inicial se encadena con .then para no fijar estado de forma
  // síncrona dentro del efecto.
  useEffect(() => {
    let isCurrent = true;

    apiFetch("/accountInfo")
      .then((res) => res.json().then((data) => ({ res, data })))
      .then(({ res, data }) => {
        if (!res.ok) {
          mostrarAlerta("error", "No se pudo cargar la cuenta", data.error);
          return;
        }

        if (isCurrent) {
          setIdusers(data.idusers);
          setCompanyName(data.companyName);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  const handleLogOut = async () => {
    await confirmarCierreSesion(navigate);
  };

  const handleEditAcept = () => {
    setActiveForm("none");
    // El usuario puede haber cambiado, así que se recargan los datos.
    fetchAccount();
  };

  // Iniciales de la empresa para el monograma de la tarjeta de identidad.
  const initials = companyName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

  return (
    <div className="mainScreen">
      <header className="headerScreen headerWithActions">
        <h3 className="tittle">{t("Mi cuenta")}</h3>
        <div className="headerActions">
          <button
            className="iconButton"
            type="button"
            onClick={handleLogOut}
            title={t("Cerrar sesion")}
          >
            <LogOut size={18} aria-hidden="true" />
            <span>{t("Cerrar sesion")}</span>
          </button>
        </div>
      </header>

      <section className="principalSection sectionFlexible">
        <div className="accountLayout">
          <article className="accountIdentity">
            <span className="accountMonogram" aria-hidden="true">
              {initials || t("Empresa").charAt(0)}
            </span>
            <p className="accountName">
              {companyName || t("Sin nombre de empresa")}
            </p>
            <p className="accountUser">
              {t("Usuario")}: {idusers || "—"}
            </p>
          </article>

          <article className="accountActions">
            <h2 className="accountActionsTitle">{t("Gestiona tu cuenta")}</h2>

            <div className="buttonsRow">
              <button
                className="optionButton"
                onClick={() => setActiveForm("edit")}
              >
                <Pencil size={18} aria-hidden="true" />
                {t("Editar datos de la cuenta")}
              </button>
              <button
                className="optionButton"
                onClick={() => setActiveForm("password")}
              >
                <KeyRound size={18} aria-hidden="true" />
                {t("Cambiar contraseña")}
              </button>
            </div>

            <div className="buttonsRow dangerRow">
              <button
                className="optionButton dangerButton"
                onClick={() => setActiveForm("delete")}
              >
                <Trash2 size={18} aria-hidden="true" />
                {t("Eliminar cuenta")}
              </button>
            </div>
          </article>
        </div>
      </section>

      <AnimatePresence>
        {activeForm === "edit" && (
          <FormEditAccount
            key="edit"
            onAcept={handleEditAcept}
            onCancel={() => setActiveForm("none")}
            currentIdusers={idusers}
            companyName={companyName}
          />
        )}
        {activeForm === "password" && (
          <FormChangePassword
            key="password"
            onAcept={() => setActiveForm("none")}
            onCancel={() => setActiveForm("none")}
          />
        )}
        {activeForm === "delete" && (
          <FormDeleteAccount
            key="delete"
            onAcept={() => setActiveForm("none")}
            onCancel={() => setActiveForm("none")}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
