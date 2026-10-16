import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { mostrarAlerta } from "../alerts/alert";
import { cerrarSesion } from "./session";

const TIEMPO_INACTIVIDAD_MS = 20 * 60 * 1000;

const EVENTOS_ACTIVIDAD = [
  "mousedown",
  "keydown",
  "mousemove",
  "touchstart",
  "wheel",
  "scroll",
];

export default function InactivityTimer() {
  const navigate = useNavigate();

  useEffect(() => {
    let temporizador: number | undefined;

    const reiniciarTemporizador = () => {
      window.clearTimeout(temporizador);
      temporizador = window.setTimeout(
        cerrarPorInactividad,
        TIEMPO_INACTIVIDAD_MS,
      );
    };

    const cerrarPorInactividad = () => {
      if (!localStorage.getItem("token")) {
        reiniciarTemporizador();
        return;
      }

      cerrarSesion(navigate);
      mostrarAlerta(
        "info",
        "Sesión cerrada por inactividad",
        "La sesión se cerró automáticamente después de 20 minutos de inactividad.",
      );
    };

    reiniciarTemporizador();

    EVENTOS_ACTIVIDAD.forEach((evento) => {
      window.addEventListener(evento, reiniciarTemporizador, {
        passive: true,
      });
    });

    return () => {
      window.clearTimeout(temporizador);
      EVENTOS_ACTIVIDAD.forEach((evento) => {
        window.removeEventListener(evento, reiniciarTemporizador);
      });
    };
  }, [navigate]);

  return null;
}
