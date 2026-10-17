import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowLeftRight,
  Boxes,
  LogOut,
  Tags,
  Truck,
  UserCog,
} from "lucide-react";
import { mostrarAlerta } from "../alerts/alert";
import apiFetch from "../api";
import { confirmarCierreSesion } from "../session/session";
import VantaBackground from "../visual/vantaBackground";
import { useTranslation } from "../i18n";

export default function MainPanel() {
  const [companyName, setCompanyName] = useState("");
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const { t } = useTranslation();

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

  const sections = [
    {
      path: "/products",
      icon: Boxes,
      title: t("Productos"),
      text: t("Da de alta, edita y borra productos y consulta sus existencias."),
    },
    {
      path: "/categories",
      icon: Tags,
      title: t("Categorias"),
      text: t("Organiza tus productos con las categorías que necesites."),
    },
    {
      path: "/providers",
      icon: Truck,
      title: t("Proveedores"),
      text: t("Mantén al día el listado de proveedores de tu empresa."),
    },
    {
      path: "/movements",
      icon: ArrowLeftRight,
      title: t("Movimientos"),
      text: t("Revisa entradas y salidas con filtros por fecha y tipo."),
    },
    {
      path: "/account",
      icon: UserCog,
      title: t("Mi cuenta"),
      text: t("Cambia tus datos, tu contraseña o elimina la cuenta."),
      isAccount: true,
    },
  ];

  const cardDelay = (index: number) => (reduceMotion ? 0 : 0.1 + index * 0.07);

  return (
    <div className="mainScreen">
      <VantaBackground variant="subtle" />

      <header className="headerScreen headerWithActions">
        <h3 className="tittle">
          {t("Hola")}, {companyName || t("empresa")}
        </h3>
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
        <div className="panelGrid">
          {sections.map((section, index) => {
            const Icon = section.icon;

            return (
              <motion.button
                key={section.path}
                type="button"
                className={`panelCard${section.isAccount ? " accountCard" : ""}`}
                onClick={() => navigate(section.path)}
                initial={
                  reduceMotion ? false : { opacity: 0, y: 22 }
                }
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: cardDelay(index),
                  ease: "easeOut",
                }}
                whileHover={reduceMotion ? undefined : { y: -4 }}
              >
                <Icon size={30} aria-hidden="true" />
                <h2 className="panelCardTitle">{section.title}</h2>
                <p className="panelCardText">{section.text}</p>
              </motion.button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
