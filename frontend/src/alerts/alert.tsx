import Swal from "sweetalert2";

export default function mostrarAlerta(
  simbol: any,
  tittle: string,
  message: string,
) {
  Swal.fire({
    title: tittle,
    text: message,
    icon: simbol,
    confirmButtonText: "Aceptar",
  });
}
