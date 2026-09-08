import { useEffect, useState } from "react";
import { mostrarAlerta } from "../alerts/alert";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

interface tokenPayload {
  idusers: string;
  rol: string;
  iat: number;
  exp: number;
}

export default function Login() {
  const [idusers, setIdusers] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("token");
  }, []);

  const handleLogin = async () => {
    if (!idusers || !password) {
      mostrarAlerta(
        "error",
        "No se pudo iniciar sesión",
        "Ingresa tu usuario y contraseña para continuar.",
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
      mostrarAlerta("error", "No se pudo iniciar sesión", data.error);
      return;
    }

    localStorage.setItem("token", data.token);

    const decodedToken = jwtDecode<tokenPayload>(data.token);

    if (decodedToken.rol === "admin") {
      navigate("/adminMain");
    } else {
      navigate("/regularMain");
    }
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
