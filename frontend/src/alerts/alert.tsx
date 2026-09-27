import Swal from "sweetalert2";

export function mostrarAlerta(simbol: any, tittle: string, message: string) {
  Swal.fire({
    title: tittle,
    text: message,
    icon: simbol,
    confirmButtonText: "Aceptar",
    customClass: { popup: "alertContainer", confirmButton: "mainButton" },
  });
}

export function mostrarConfirmacion(
  simbol: any,
  tittle: string,
  message: string,
) {
  return Swal.fire({
    showCancelButton: true,
    cancelButtonText: "cancelar",
    confirmButtonText: "aceptar",
    icon: simbol,
    title: tittle,
    text: message,
    customClass: {
      popup: "alertContainer",
      confirmButton: "mainButton",
      cancelButton: "mainButton secundary",
    },
  });
}
