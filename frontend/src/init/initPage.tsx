import { useNavigate } from "react-router-dom";

export default function InitPage() {
  const navigate = useNavigate();

  return (
    <div className="mainScreen">
      <header className="headerScreen">
        <h3 className="tittle">Sistema de inventario</h3>
      </header>
      <section className="principalSection">
        <p className="infoP">
          Bienvenido al sistema de inventario, gestiona tus productos por
          categoria de manera completamente libre.
        </p>
        <p className="infoP">Da click en el boton para iniciar sesion:</p>

        <button
          className="mainButton"
          onClick={() => {
            navigate("/login");
          }}
        >
          INICIAR SESION
        </button>
      </section>
    </div>
  );
}
