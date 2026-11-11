// Lógica del reporte de movimientos: tipos, funciones puras y agregados.
// Solo datos (sin JSX ni componentes) para no activar la regla
// react-refresh/only-export-components.

export interface ReportItem {
  product_name: string;
  product_code: string;
  amount: number;
  unit_value: number;
  line_value: number;
}

export interface ReportMovement {
  idmovements: number;
  movement_type: string;
  dateFormatted: string;
  total: number;
  items: ReportItem[];
}

export interface ReportData {
  initDate: string;
  finalDate: string;
  generadoEn: string;
  movements: ReportMovement[];
  gastos: number; // Σ total de las entradas
  ganancias: number; // Σ total de las salidas
  granTotal: number; // ganancias - gastos
}

// Forma que devuelve GET /filterMovements (el detalle tal cual lo envía el
// backend, con el valor unitario y el importe de línea ya redondeados).
export interface ReportRawItem {
  product_name: string;
  product_code: string | null;
  category: string;
  amount: number;
  unit_value: number;
  line_value: number;
}

export interface ReportRawMovement {
  idmovements: number;
  movement_type: string;
  date_movement: string;
  total: number;
  items: ReportRawItem[];
}

// Redondeo a céntimos: el mismo criterio que usa el backend al calcular el
// total de cada movimiento, para que los agregados coincidan con el
// historial.
function centimos(valor: number): number {
  return Math.round(valor * 100) / 100;
}

// Formatea la fecha y hora durante la carga (nunca en el render, por la
// regla de pureza de los hooks): AAAA-MM-DD HH:mm:ss con getters locales.
export function formatReportDate(dateMovement: string): string {
  const date = new Date(dateMovement);
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

// Fecha y hora del momento en que se genera el informe. Se llama desde el
// manejador del botón, nunca durante el render.
export function formatCurrentDate(): string {
  return formatReportDate(new Date().toISOString());
}

// Rango por defecto: primer día del mes en curso y hoy (AAAA-MM-DD). Se
// llama desde el efecto de montaje, nunca durante el render.
export function defaultDateRange(): {
  initDate: string;
  finalDate: string;
} {
  const today = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

  return {
    initDate: `${firstDay.getFullYear()}-${pad(firstDay.getMonth() + 1)}-01`,
    finalDate: `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`,
  };
}

// Línea de producto del reporte: "Nombre (CÓDIGO) x5 — 42.50". El informe
// es un documento autónomo, así que aquí sí aparece el código (el historial
// no lo muestra).
export function formatProductLine(item: ReportItem): string {
  const codigo = item.product_code ? ` (${item.product_code})` : "";
  return `${item.product_name}${codigo} x${item.amount} — ${item.line_value.toFixed(2)}`;
}

// Etiqueta del tipo de movimiento ("Entrada" / "Salida"), traducida con el
// traductor que le pasa el componente.
export function movementTypeLabel(
  movementType: string,
  translate: (text: string) => string,
): string {
  return movementType === "salida"
    ? translate("Salida")
    : translate("Entrada");
}

// Construye el informe: mapea la respuesta de la API y calcula los
// agregados sumando los `total` que ya devuelve el backend (así coinciden
// exactamente con los "Total" del historial).
export function buildReport(
  movements: ReportRawMovement[],
  initDate: string,
  finalDate: string,
  generadoEn: string,
): ReportData {
  const mapped: ReportMovement[] = movements.map((movement) => ({
    idmovements: movement.idmovements,
    movement_type: movement.movement_type,
    dateFormatted: formatReportDate(movement.date_movement),
    total: movement.total,
    items: movement.items.map((item) => ({
      product_name: item.product_name,
      product_code: item.product_code ?? "",
      amount: item.amount,
      unit_value: item.unit_value,
      line_value: item.line_value,
    })),
  }));

  const gastos = centimos(
    mapped
      .filter((movement) => movement.movement_type === "entrada")
      .reduce((suma, movement) => suma + movement.total, 0),
  );

  const ganancias = centimos(
    mapped
      .filter((movement) => movement.movement_type === "salida")
      .reduce((suma, movement) => suma + movement.total, 0),
  );

  const diferencia = centimos(ganancias - gastos);

  return {
    initDate,
    finalDate,
    generadoEn,
    movements: mapped,
    gastos,
    ganancias,
    // El cero negativo se normaliza: 0 y no -0 (si no, se vería "-0.00").
    granTotal: diferencia === 0 ? 0 : diferencia,
  };
}
