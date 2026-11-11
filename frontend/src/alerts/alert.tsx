import Swal, {
  type SweetAlertIcon,
  type SweetAlertResult,
} from "sweetalert2";
import { translateText } from "../i18n";

// Todo lo que se inyecta en SweetAlert2 como HTML (el título, el mensaje,
// los rótulos de los botones y el resumen del movimiento) puede traer
// datos de la base de datos (nombre y código del producto), que elige el
// usuario: se escapan para que no puedan inyectar etiquetas. El orden es
// siempre traducir y después escapar.
function escaparHtml(texto: string): string {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function mostrarAlerta(
  simbol: SweetAlertIcon,
  title: string,
  message = "",
) {
  Swal.fire({
    title: escaparHtml(translateText(title)),
    html: escaparHtml(
      translateText(
        message ||
          (simbol === "error"
            ? "No fue posible completar la solicitud. Inténtelo de nuevo."
            : ""),
      ),
    ),
    icon: simbol,
    confirmButtonText: escaparHtml(translateText("Aceptar")),
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
    cancelButtonText: escaparHtml(translateText("cancelar")),
    confirmButtonText: escaparHtml(translateText("aceptar")),
    icon: simbol,
    title: escaparHtml(translateText(title)),
    html: escaparHtml(translateText(message)),
    customClass: {
      popup: "alertContainer",
      confirmButton: "mainButton secundary",
    },
  });
}

// Resumen tabular de una confirmación: tipo, cabeceras, filas, total
// opcional y nota final. Los rótulos son claves del diccionario (español)
// y los datos ya vienen formateados por el componente.
export interface ResumenDetalle {
  tipo: string; // rótulo del tipo (clave en español)
  cabecera: string[]; // cabeceras de la tabla
  filas: string[][]; // filas (celdas ya formateadas)
  total?: { etiqueta: string; valor: string };
  nota?: string; // aviso final
}

// Confirmación con resumen tabular: los rótulos se traducen y después se
// escapan; los datos de las celdas se escapan pero no se traducen. El
// título y los rótulos de los botones también se escapan (SweetAlert2 los
// renderiza como HTML); la tabla no se vuelve a escapar para no duplicarlo.
export function mostrarConfirmacionDetalle(
  simbol: SweetAlertIcon,
  title: string,
  detalle: ResumenDetalle,
): Promise<SweetAlertResult> {
  const cabecera = detalle.cabecera
    .map(
      (columna) =>
        `<th scope="col">${escaparHtml(translateText(columna))}</th>`,
    )
    .join("");

  const filas = detalle.filas
    .map(
      (celdas) =>
        `<tr>${celdas
          .map((celda) => `<td>${escaparHtml(celda)}</td>`)
          .join("")}</tr>`,
    )
    .join("");

  const pie = detalle.total
    ? `<tfoot><tr><th scope="row">${escaparHtml(translateText(detalle.total.etiqueta))}</th>` +
      `<td colspan="3"></td>` +
      `<td>${escaparHtml(detalle.total.valor)}</td></tr></tfoot>`
    : "";

  const nota = detalle.nota
    ? `<p class="movementSummaryNote">${escaparHtml(translateText(detalle.nota))}</p>`
    : "";

  const html =
    `<div class="movementSummary">` +
    `<p class="movementSummaryType">${escaparHtml(translateText(detalle.tipo))}</p>` +
    `<table class="movementSummaryTable"><thead><tr>${cabecera}</tr></thead>` +
    `<tbody>${filas}</tbody>${pie}</table>${nota}</div>`;

  return Swal.fire({
    showCancelButton: true,
    cancelButtonText: escaparHtml(translateText("Cancelar")),
    confirmButtonText: escaparHtml(translateText("Registrar movimiento")),
    icon: simbol,
    title: escaparHtml(translateText(title)),
    html,
    focusConfirm: true,
    focusCancel: false,
    allowOutsideClick: false,
    allowEscapeKey: true,
    width: "560px",
    customClass: {
      popup: "alertContainer",
      confirmButton: "mainButton",
      cancelButton: "mainButton secundary",
    },
  });
}
