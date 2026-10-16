import type { NavigateFunction } from "react-router-dom";
import { mostrarConfirmacion } from "../alerts/alert";

export function cerrarSesion(navigate: NavigateFunction) {
  localStorage.removeItem("token");
  navigate("/", { replace: true });
}

export async function confirmarCierreSesion(navigate: NavigateFunction) {
  const result = await mostrarConfirmacion(
    "question",
    "¿Deseas cerrar sesión?",
    "Tendrás que iniciar sesión de nuevo para acceder.",
  );

  if (!result.isConfirmed) {
    return false;
  }

  cerrarSesion(navigate);
  return true;
}
