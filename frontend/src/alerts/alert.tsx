import Swal, { type SweetAlertIcon } from "sweetalert2";

export function mostrarAlerta(
  simbol: SweetAlertIcon,
  title: string,
  message = "",
) {
  Swal.fire({
    title,
    text:
      message ||
      (simbol === "error"
        ? "No fue posible completar la solicitud. Inténtelo de nuevo."
        : ""),
    icon: simbol,
    confirmButtonText: "Aceptar",
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
    cancelButtonText: "cancelar",
    confirmButtonText: "aceptar",
    icon: simbol,
    title,
    text: message,
    customClass: {
      popup: "alertContainer",
      confirmButton: "mainButton",
      cancelButton: "mainButton secundary",
    },
  });
}
