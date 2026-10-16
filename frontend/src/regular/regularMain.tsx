import { useNavigate } from "react-router-dom";
import { useTranslation } from "../i18n";
import { confirmarCierreSesion } from "../session/session";
export default function MainRegular() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const handleLogOut = async () => {
    await confirmarCierreSesion(navigate);
  };
  return (
    <div className="mainScreen">
      <header className="headerScreen">
        <h3 className="tittle">{t("Panel regular")}</h3>
      </header>
      <section className="principalSection">
        <p className="infoP">
          {t("Bienvenido al panel regular, que vas a hacer hoy?")}
        </p>

        <button
          className="optionButton"
          onClick={() => {
            navigate("/productsReg");
          }}
        >
          {t("Administrar productos")}
        </button>
        <button className="optionButton secundary" onClick={handleLogOut}>
          {t("Cerrar sesion")}
        </button>
      </section>
    </div>
  );
}
