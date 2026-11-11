import { translateText } from "../i18n";
import {
  formatProductLine,
  movementTypeLabel,
  type ReportData,
} from "./reportBuilder";

// Colores equivalentes a las variables CSS del historial:
// --color-gain (verde), --color-loss (rojo) y --color-ink.
const COLOR_GAIN = "#1f9d55";
const COLOR_LOSS = "#d64545";
const COLOR_INK = "#14181f";

// Ancho útil de la página A4 con los márgenes del documento (595.28 - 80).
const CONTENT_WIDTH = 515;

// Genera y descarga el PDF del reporte.
//
// pdfmake y sus fuentes se cargan con importación dinámica: el chunk (~1,7 MB)
// solo se descarga cuando el usuario pulsa "Descargar PDF", así que el bundle
// inicial no crece.
export async function descargarReportePdf(
  report: ReportData,
  companyName: string,
  idusers: string,
): Promise<void> {
  const [pdfMakeModule, pdfFontsModule] = await Promise.all([
    import("pdfmake/build/pdfmake"),
    import("pdfmake/build/vfs_fonts"),
  ]);

  const pdfMake = pdfMakeModule.default;
  const pdfFonts = pdfFontsModule.default;

  // pdfmake 0.3.x: el módulo de fuentes exporta el mapa de ficheros virtual
  // directamente (no el envoltorio { pdfMake: { vfs } } de las versiones 0.2.x).
  pdfMake.addVirtualFileSystem(pdfFonts);

  // Roboto cubre ñ, á, é, ¿, ¡ y ×; las fuentes estándar del PDF solo
  // soportan ANSI y romperían los acentos del español.
  pdfMake.setFonts({
    Roboto: {
      normal: "Roboto-Regular.ttf",
      bold: "Roboto-Medium.ttf",
      italics: "Roboto-Italic.ttf",
      bolditalics: "Roboto-MediumItalic.ttf",
    },
  });

  const empresa = companyName || translateText("Sin nombre de empresa");

  const cabecera = [
    {
      text: empresa,
      bold: true,
      fontSize: 12,
    },
    {
      text: `${translateText("Usuario")}: ${idusers}`,
      fontSize: 9,
    },
    {
      text: `${translateText("Periodo")}: ${report.initDate} — ${report.finalDate}`,
      fontSize: 9,
    },
    {
      text: `${translateText("Generado el")}: ${report.generadoEn}`,
      fontSize: 9,
    },
  ];

  const colorGranTotal =
    report.granTotal > 0
      ? COLOR_GAIN
      : report.granTotal < 0
        ? COLOR_LOSS
        : COLOR_INK;

  const documentDefinition = {
    info: {
      title: translateText("Reporte de movimientos"),
      author: empresa,
      subject: `${translateText("Periodo")}: ${report.initDate} — ${report.finalDate}`,
      creator: translateText("Inventario"),
    },
    pageSize: "A4",
    // El margen superior deja sitio a la cabecera (título en la primera
    // página + empresa, usuario, periodo y fecha de generación): con 60 se
    // recortaba la última línea de la cabecera.
    pageMargins: [40, 100, 40, 60] as [number, number, number, number],
    defaultStyle: {
      font: "Roboto",
      fontSize: 9,
    },
    // La cabecera se repite en todas las páginas.
    header: (currentPage: number) => ({
      margin: [0, 0, 0, 12],
      stack: [
        ...(currentPage === 1
          ? [
              {
                text: translateText("Reporte de movimientos"),
                bold: true,
                fontSize: 15,
                margin: [0, 0, 0, 6] as [number, number, number, number],
              },
            ]
          : []),
        ...cabecera,
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: CONTENT_WIDTH,
              y2: 0,
              lineWidth: 1,
              lineColor: "#9aa3b2",
            },
          ],
          margin: [0, 6, 0, 0] as [number, number, number, number],
        },
      ],
    }),
    content: [
      {
        table: {
          headerRows: 1,
          widths: ["auto", "auto", "*", "auto"],
          body: [
            [
              { text: translateText("Fecha y hora"), bold: true },
              { text: translateText("Tipo"), bold: true },
              { text: translateText("Productos"), bold: true },
              { text: translateText("Total"), bold: true, alignment: "right" },
            ],
            ...report.movements.map((movement) => [
              movement.dateFormatted,
              movementTypeLabel(movement.movement_type, translateText),
              movement.items.map((item) => formatProductLine(item)).join("\n"),
              {
                text: movement.total.toFixed(2),
                alignment: "right",
              },
            ]),
          ],
        },
        layout: "lightHorizontalLines",
      },
      // Los totales van al final del documento.
      {
        table: {
          widths: ["*", "auto"],
          body: [
            [
              { text: translateText("Total de gastos"), bold: true },
              {
                text: report.gastos.toFixed(2),
                alignment: "right",
                color: COLOR_LOSS,
              },
            ],
            [
              { text: translateText("Total de ganancias"), bold: true },
              {
                text: report.ganancias.toFixed(2),
                alignment: "right",
                color: COLOR_GAIN,
              },
            ],
            [
              {
                text: translateText("Gran total"),
                bold: true,
                fontSize: 12,
              },
              {
                text: report.granTotal.toFixed(2),
                alignment: "right",
                bold: true,
                fontSize: 12,
                color: colorGranTotal,
              },
            ],
          ],
        },
        margin: [0, 16, 0, 0] as [number, number, number, number],
      },
    ],
    footer: (currentPage: number, pageCount: number) => ({
      text: `${translateText("Página")} ${currentPage} / ${pageCount}`,
      alignment: "center",
      fontSize: 8,
      margin: [0, 10, 0, 0] as [number, number, number, number],
    }),
  };

  // El nombre del fichero sigue el idioma activo en el momento de la
  // descarga: translateText lee la preferencia guardada en el navegador.
  const nombreFichero = `${translateText("Reporte-movimientos")}-${report.initDate}-${report.finalDate}.pdf`;

  pdfMake.createPdf(documentDefinition).download(nombreFichero);
}
