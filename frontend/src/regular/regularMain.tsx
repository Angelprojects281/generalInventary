import { useNavigate } from "react-router-dom";
import { mostrarConfirmacion } from "../alerts/alert";
export default function MainRegular() {
  const navigate = useNavigate();
  const handleLogOut = async () => {
    const result = await mostrarConfirmacion(
      "question",
      "deseas cerrar sesion?",
      "",
    );

    if (!result.isConfirmed) {
      return;
    }
    localStorage.removeItem("token");
    navigate("/");
  };
  return (
    <div className="mainScreen">
      <header className="headerScreen">
        <h3 className="tittle">Panel regular</h3>
      </header>
      <section className="principalSection">
        <p className="infoP">
          Bienvenido al panel regular, que vas a hacer hoy?
        </p>

        <button className="optionButton">Administrar productos</button>
        <button className="optionButton">Nuevo movimiento</button>
        <button className="optionButton secundary" onClick={handleLogOut}>
          Cerrar sesion
        </button>
      </section>
    </div>
  );
}
