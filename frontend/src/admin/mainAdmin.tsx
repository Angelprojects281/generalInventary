import { useNavigate } from "react-router-dom";
export default function MainAdmin() {
  const navigate = useNavigate();
  const handleLogOut = async () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
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
        <button
          className="optionButton"
          onClick={() => {
            navigate("/adminCategory");
          }}
        >
          Administrar categorias
        </button>
        <button
          className="optionButton"
          onClick={() => {
            navigate("/adminProviders");
          }}
        >
          Administrar proveedores
        </button>
        <button
          className="optionButton"
          onClick={() => {
            navigate("/adminMovements");
          }}
        >
          Administrar movimientos
        </button>
        <button className="optionButton secundary" onClick={handleLogOut}>
          Cerrar sesion
        </button>
      </section>
    </div>
  );
}
