import { useNavigate } from "react-router-dom";
export default function MainRegular() {
  const navigate = useNavigate();
  const handleLogOut = async () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
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
