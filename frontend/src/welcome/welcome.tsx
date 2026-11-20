import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, Boxes, ClipboardList, ShieldCheck, UserRound } from "lucide-react";
import FormLogin from "./formLogin";
import FormRegister from "./formRegister";
import FormVerify from "./formVerify";
import FormForgotPassword from "./formForgotPassword";
import FormResetPassword from "./formResetPassword";
import VantaBackground from "../visual/vantaBackground";
import { useTranslation } from "../i18n";

type openForm =
  | "login"
  | "register"
  | "verify"
  | "forgot"
  | "reset"
  | null;

// Contexto de los flujos multi-paso: verificacion (usuario + correo) y
// recuperacion (correo). Todo vive en "/" sin rutas nuevas.
type verifyContext = { idusers: string; email: string };

export default function Welcome() {
  const [form, setForm] = useState<openForm>(null);
  const [verificacion, setVerificacion] = useState<verifyContext | null>(
    null,
  );
  const [emailRecuperacion, setEmailRecuperacion] = useState("");
  const reduceMotion = useReducedMotion();
  const { t } = useTranslation();

  // Con movimiento reducido no se anima: todo aparece en su sitio.
  const rise = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay, ease: "easeOut" as const },
        };

  return (
    <div className="mainScreen">
      <VantaBackground />

      <header className="headerScreen">
        <h3 className="tittle">{t("Bienvenido a tu inventario")}</h3>
      </header>

      <section className="heroSection">
        <div className="heroCopy">
          <motion.h1 className="heroTitle" {...rise(0.05)}>
            {t("Tu inventario, siempre bajo control")}
          </motion.h1>

          <motion.p className="heroSubtitle" {...rise(0.15)}>
            {t(
              "Crea la cuenta de tu empresa y gestiona productos, categorías, proveedores y movimientos desde un único panel, sin complicaciones.",
            )}
          </motion.p>

          <motion.ul className="heroPoints" {...rise(0.25)}>
            <li className="heroPoint">
              <Boxes size={20} aria-hidden="true" />
              {t("Productos y categorías organizados a tu manera")}
            </li>
            <li className="heroPoint">
              <ClipboardList size={20} aria-hidden="true" />
              {t("Entradas y salidas registradas con su historial")}
            </li>
            <li className="heroPoint">
              <ShieldCheck size={20} aria-hidden="true" />
              {t("Cada empresa ve solo su propio inventario")}
            </li>
          </motion.ul>

          <motion.div className="buttonsRow" {...rise(0.35)}>
            <button
              className="mainButton"
              onClick={() => setForm("register")}
            >
              {t("Crear una cuenta")}
              <ArrowRight size={18} aria-hidden="true" />
            </button>
            <button
              className="optionButton"
              onClick={() => setForm("login")}
            >
              <UserRound size={18} aria-hidden="true" />
              {t("Iniciar sesión")}
            </button>
          </motion.div>
        </div>

        <motion.div
          className="heroArt"
          aria-hidden="true"
          {...(reduceMotion
            ? {}
            : {
                initial: { opacity: 0, scale: 0.94 },
                animate: { opacity: 1, scale: 1 },
                transition: { duration: 0.6, delay: 0.2, ease: "easeOut" as const },
              })}
        >
          <span className="heroArtBadge badgeA">
            <ClipboardList size={30} />
          </span>
          <span className="heroArtBadge badgeB">
            <ShieldCheck size={24} />
          </span>
          <span className="heroArtBadge badgeC">
            <UserRound size={26} />
          </span>
          <span className="heroArtCore">
            <Boxes size={96} strokeWidth={1.4} />
          </span>
        </motion.div>
      </section>

      <section className="featureGrid">
        <motion.article
          className="featureCard"
          {...(reduceMotion
            ? {}
            : {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.45, delay: 0.45, ease: "easeOut" as const },
              })}
        >
          <Boxes size={26} aria-hidden="true" />
          <h2 className="featureCardTitle">{t("Empieza en un minuto")}</h2>
          <p className="featureCardText">
            {t(
              "Crea tu cuenta con un usuario, el nombre de tu empresa y una contraseña.",
            )}
          </p>
        </motion.article>

        <motion.article
          className="featureCard"
          {...(reduceMotion
            ? {}
            : {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.45, delay: 0.55, ease: "easeOut" as const },
              })}
        >
          <ClipboardList size={26} aria-hidden="true" />
          <h2 className="featureCardTitle">{t("Todo en un solo panel")}</h2>
          <p className="featureCardText">
            {t(
              "Productos, categorías, proveedores y movimientos con filtros y búsqueda rápida.",
            )}
          </p>
        </motion.article>

        <motion.article
          className="featureCard"
          {...(reduceMotion
            ? {}
            : {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.45, delay: 0.65, ease: "easeOut" as const },
              })}
        >
          <ShieldCheck size={26} aria-hidden="true" />
          <h2 className="featureCardTitle">{t("Tu inventario es tuyo")}</h2>
          <p className="featureCardText">
            {t(
              "Los datos de cada empresa están aislados y puedes eliminar tu cuenta cuando quieras.",
            )}
          </p>
        </motion.article>
      </section>

      <AnimatePresence>
        {form === "login" && (
          <FormLogin
            key="login"
            onCancel={() => setForm(null)}
            onUnverified={(idusers) => {
              // Cuenta sin verificar: se abre la verificacion sin correo
              // prellenado; el formulario lo pide solo para reenviar.
              setVerificacion({ idusers, email: "" });
              setForm("verify");
            }}
            onForgot={() => setForm("forgot")}
          />
        )}
        {form === "register" && (
          <FormRegister
            key="register"
            onCancel={() => setForm(null)}
            onRegistered={(cuenta) => {
              setVerificacion(cuenta);
              setForm("verify");
            }}
          />
        )}
        {form === "verify" && verificacion && (
          <FormVerify
            key="verify"
            idusers={verificacion.idusers}
            email={verificacion.email}
            onCancel={() => setForm(null)}
          />
        )}
        {form === "forgot" && (
          <FormForgotPassword
            key="forgot"
            onCancel={() => setForm(null)}
            onSent={(email) => {
              setEmailRecuperacion(email);
              setForm("reset");
            }}
          />
        )}
        {form === "reset" && (
          <FormResetPassword
            key="reset"
            email={emailRecuperacion}
            onCancel={() => setForm(null)}
            onReset={() => setForm("login")}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
