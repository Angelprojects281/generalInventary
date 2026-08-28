import Swal from "sweetalert2";

export function mostrarAlerta(simbol: any, tittle: string, message: string) {
  Swal.fire({
    title: tittle,
    text: message,
    icon: simbol,
    confirmButtonText: "Aceptar",
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
  });
}
