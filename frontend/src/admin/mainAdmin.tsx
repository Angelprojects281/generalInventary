import { useNavigate } from "react-router-dom";
import { mostrarConfirmacion } from "../alerts/alert";
export default function MainAdmin() {
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
        <h3 className="tittle">Panel de administrador</h3>
      </header>
      <section className="principalSection">
        <p className="infoP">
          Bienvenido al panel de administrador, que vas a hacer hoy?
        </p>

        <button
          className="optionButton"
          onClick={() => {
            navigate("/adminUsers");
          }}
        >
          Administrar usuarios
        </button>
        <button className="optionButton">Administrar categorias</button>
        <button className="optionButton">Administrar movimientos</button>
        <button className="optionButton">Cambios de contraseña</button>
        <button className="optionButton secundary" onClick={handleLogOut}>
          Cerrar sesion
        </button>
      </section>
    </div>
  );
}
