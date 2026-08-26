import { useState } from "react";
import mostrarAlerta from "../alerts/alert";

export default function Login() {
  const [idusers, setIdusers] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!idusers || !password) {
      mostrarAlerta(
        "error",
        "Error al iniciar sesion",
        "ingrese su usuario y contraseña",
      );
      return;
    }

    const res = await fetch("http://localhost:3000/logIn", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idusers, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      mostrarAlerta("error", "error al iniciar sesion", data.error);
      return;
    }

    localStorage.setItem("token", data.token);
    mostrarAlerta("success", "inicio de sesion correcto", data.token);
  };

  return (
    <div className="mainScreen">
      <header className="headerScreen">
        <h3 className="tittle">Inicio de sesion</h3>
      </header>
      <section className="principalSection">
        <p className="infoP">Introduce tu usuario y contraseña:</p>

        <input
          placeholder="usuario"
          type="text"
          className="userInput"
          onChange={(e) => {
            setIdusers(e.target.value);
          }}
        ></input>
        <input
          placeholder="contraseña"
          type="password"
          className="userInput"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        ></input>

        <button className="mainButton" onClick={handleLogin}>
          INICIAR SESION
        </button>
      </section>
    </div>
  );
}
