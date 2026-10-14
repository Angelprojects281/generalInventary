import { useNavigate } from "react-router-dom";
import { useTranslation } from "../i18n";
export default function MainAdmin() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const handleLogOut = async () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };
  return (
    <div className="mainScreen">
      <header className="headerScreen">
        <h3 className="tittle">{t("Panel de administrador")}</h3>
      </header>
      <section className="principalSection">
        <p className="infoP">
          {t("Bienvenido al panel de administrador, que vas a hacer hoy?")}
        </p>

        <button
          className="optionButton"
          onClick={() => {
            navigate("/adminUsers");
          }}
        >
          {t("Administrar usuarios")}
        </button>
        <button
          className="optionButton"
          onClick={() => {
            navigate("/adminCategory");
          }}
        >
          {t("Administrar categorias")}
        </button>
        <button
          className="optionButton"
          onClick={() => {
            navigate("/adminProviders");
          }}
        >
          {t("Administrar proveedores")}
        </button>
        <button
          className="optionButton"
          onClick={() => {
            navigate("/adminMovements");
          }}
        >
          {t("Administrar movimientos")}
        </button>
        <button className="optionButton secundary" onClick={handleLogOut}>
          {t("Cerrar sesion")}
        </button>
      </section>
    </div>
  );
}
