import Swal, { type SweetAlertIcon } from "sweetalert2";
import { translateText } from "../i18n";

export function mostrarAlerta(
  simbol: SweetAlertIcon,
  title: string,
  message = "",
) {
  Swal.fire({
    title: translateText(title),
    text:
      translateText(
        message ||
          (simbol === "error"
            ? "No fue posible completar la solicitud. Inténtelo de nuevo."
            : ""),
      ),
    icon: simbol,
    confirmButtonText: translateText("Aceptar"),
    customClass: { popup: "alertContainer", confirmButton: "mainButton" },
  });
}

export function mostrarConfirmacion(
  simbol: SweetAlertIcon,
  title: string,
  message: string,
) {
  return Swal.fire({
    showCancelButton: true,
    cancelButtonText: translateText("cancelar"),
    confirmButtonText: translateText("aceptar"),
    icon: simbol,
    title: translateText(title),
    text: translateText(message),
    customClass: {
      popup: "alertContainer",
      confirmButton: "mainButton",
      cancelButton: "mainButton secundary",
    },
  });
}
