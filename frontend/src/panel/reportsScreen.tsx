import { useState, useEffect } from "react";
import apiFetch from "../api";
import { mostrarAlerta } from "../alerts/alert";
import { useTranslation } from "../i18n";
import {
  buildReport,
  defaultDateRange,
  formatCurrentDate,
  formatProductLine,
  movementTypeLabel,
  type ReportData,
  type ReportRawMovement,
} from "./reportBuilder";
import { descargarReportePdf } from "./reportPdf";

// Umbral a partir del cual se avisa de que el informe será extenso.
const AVISO_MUCHOS_MOVIMIENTOS = 300;

export default function ReportsScreen() {
  const [initDate, setInitDate] = useState("");
  const [finalDate, setFinalDate] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [idusers, setIdusers] = useState("");
  const [report, setReport] = useState<ReportData | null>(null);
  const [generating, setGenerating] = useState(false);
  const [descargando, setDescargando] = useState(false);
  const { t } = useTranslation();

  // El rango por defecto (mes en curso) se calcula aquí, nunca durante el
  // render, y la carga se encadena con .then para no fijar estado de forma
  // síncrona dentro del efecto.
  useEffect(() => {
    let isCurrent = true;

    const rango = defaultDateRange();

    Promise.resolve()
      .then(() => {
        if (isCurrent) {
          setInitDate(rango.initDate);
          setFinalDate(rango.finalDate);
        }
      })
      .then(() => apiFetch("/accountInfo"))
      .then((res) => res.json().then((data) => ({ res, data })))
      .then(({ res, data }) => {
        if (!isCurrent) return;
        if (!res.ok) {
          mostrarAlerta("error", "No se pudo cargar la cuenta", data.error);
          return;
        }
        setCompanyName(data.companyName);
        setIdusers(data.idusers);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  // Cambiar las fechas invalida el informe: el PDF que se descargaría ya no
  // correspondería al rango seleccionado.
  const cambiarInitDate = (value: string) => {
    setInitDate(value);
    setReport(null);
  };

  const cambiarFinalDate = (value: string) => {
    setFinalDate(value);
    setReport(null);
  };

  const generarReporte = async () => {
    if (generating) return;

    // Título de las alertas del reporte (el mensaje lleva el motivo).
    const reportTitle = "Reporte de movimientos";

    if (!initDate || !finalDate) {
      mostrarAlerta(
        "error",
        reportTitle,
        "Selecciona un rango de fechas para generar el reporte.",
      );
      return;
    }

    // Las fechas son "AAAA-MM-DD": la comparación lexicográfica equivale a la
    // cronológica.
    if (initDate > finalDate) {
      mostrarAlerta(
        "error",
        reportTitle,
        "La fecha inicial no puede ser posterior a la fecha final.",
      );
      return;
    }

    setGenerating(true);

    try {
      const res = await apiFetch(
        `/filterMovements?initDate=${initDate}&finalDate=${finalDate}`,
        { method: "GET" },
      );

      const data = await res.json();

      if (!res.ok) {
        mostrarAlerta("error", reportTitle, data.error);
        return;
      }

      // El momento de generación se calcula aquí, nunca en el render.
      const generadoEn = formatCurrentDate();

      const nuevoReporte = buildReport(
        data as ReportRawMovement[],
        initDate,
        finalDate,
        generadoEn,
      );

      setReport(nuevoReporte);

      mostrarAlerta(
        "success",
        reportTitle,
        "Reporte generado correctamente.",
      );

      if (nuevoReporte.movements.length > AVISO_MUCHOS_MOVIMIENTOS) {
        mostrarAlerta(
          "info",
          reportTitle,
          "El rango seleccionado contiene muchos movimientos; el informe será extenso.",
        );
      }
    } catch {
      mostrarAlerta(
        "error",
        reportTitle,
        "No se pudo generar el reporte. Inténtelo de nuevo.",
      );
    } finally {
      setGenerating(false);
    }
  };

  const descargarPdf = async () => {
    if (!report || descargando) return;

    setDescargando(true);

    try {
      await descargarReportePdf(report, companyName, idusers);
    } catch {
      mostrarAlerta(
        "error",
        "Reporte de movimientos",
        "No se pudo generar el reporte. Inténtelo de nuevo.",
      );
    } finally {
      setDescargando(false);
    }
  };

  return (
    <div className="mainScreen">
      <header className="headerScreen">
        <h3 className="tittle">{t("Reporte de movimientos")}</h3>
      </header>

      {/* La clase .filterSection es la barra de filtros plegable del
          proyecto: sin la clase .filtersExpanded su regla oculta todos los
          hijos. Aquí la fila nunca se pliega, así que va siempre desplegada. */}
      <section className="filterSection reportFilterSection filtersExpanded">
        <p className="filterText filterLabel">{t("Rango de fechas")}</p>
        <input
          type="date"
          className="filterSelect"
          aria-label={t("Fecha inicial")}
          value={initDate}
          onChange={(e) => cambiarInitDate(e.target.value)}
        />
        <input
          type="date"
          className="filterSelect"
          aria-label={t("Fecha final")}
          value={finalDate}
          onChange={(e) => cambiarFinalDate(e.target.value)}
        />
        <button
          className="optionButton"
          onClick={generarReporte}
          disabled={generating}
        >
          {generating ? t("Generando el informe...") : t("Generar reporte")}
        </button>
        <button
          className="optionButton secundary"
          onClick={descargarPdf}
          disabled={!report || report.movements.length === 0 || descargando}
        >
          {t("Descargar PDF")}
        </button>
      </section>

      {report && (
        <section className="principalSection sectionFlexible">
          <div className="reportDocument">
            <div className="reportHeader">
              <p className="reportHeaderTitle">
                {companyName || t("Sin nombre de empresa")}
              </p>
              <p className="reportHeaderLine">{`${t("Usuario")}: ${idusers}`}</p>
              <p className="reportHeaderLine">
                {`${t("Periodo")}: ${report.initDate} — ${report.finalDate}`}
              </p>
              <p className="reportHeaderLine">
                {`${t("Generado el")}: ${report.generadoEn}`}
              </p>
            </div>

            <div className="reportSummary">
              <article className="reportSummaryCard">
                <p className="reportSummaryLabel">{t("Total de gastos")}</p>
                <p className="reportSummaryValue reportNegative">
                  {report.gastos.toFixed(2)}
                </p>
              </article>
              <article className="reportSummaryCard">
                <p className="reportSummaryLabel">{t("Total de ganancias")}</p>
                <p className="reportSummaryValue reportPositive">
                  {report.ganancias.toFixed(2)}
                </p>
              </article>
              <article className="reportSummaryCard">
                <p className="reportSummaryLabel">{t("Gran total")}</p>
                <p
                  className={`reportSummaryValue ${
                    report.granTotal < 0
                      ? "reportNegative"
                      : report.granTotal > 0
                        ? "reportPositive"
                        : ""
                  }`}
                >
                  {report.granTotal.toFixed(2)}
                </p>
              </article>
            </div>

            <p className="reportHeaderLine">
              {`${t("Movimientos")}: ${report.movements.length}`}
            </p>

            {report.movements.length === 0 ? (
              <p className="reportEmpty">
                {t("No hay movimientos en el rango seleccionado.")}
              </p>
            ) : (
              <ul className="infoList">
                <li className="lineList">
                  <p className="listInfo">{t("Fecha y hora")}</p>
                  <p className="listInfo">{t("Tipo")}</p>
                  <p className="listInfo">{t("Productos")}</p>
                  <p className="listInfo">{t("Total")}</p>
                </li>
                {report.movements.map((movement) => {
                  const isOutbound = movement.movement_type === "salida";

                  return (
                    <li
                      key={movement.idmovements}
                      className="lineList"
                    >
                      <p
                        className="listInfo lastInfo"
                        data-label={t("Fecha y hora")}
                      >
                        {movement.dateFormatted}
                      </p>
                      <p
                        className="listInfo lastInfo"
                        data-label={t("Tipo")}
                      >
                        {movementTypeLabel(movement.movement_type, t)}
                      </p>
                      <p
                        className="listInfo lastInfo historyProducts"
                        data-label={t("Productos")}
                      >
                        <span className="historyProductLines">
                          {movement.items.map((item, index) => (
                            <span
                              key={`${movement.idmovements}-${index}`}
                              className="historyProductLine"
                            >
                              {formatProductLine(item)}
                            </span>
                          ))}
                        </span>
                      </p>
                      <p
                        className={`listInfo lastInfo historyTotal ${isOutbound ? "historyGain" : "historyLoss"}`}
                        data-label={t("Total")}
                      >
                        {movement.total.toFixed(2)}
                      </p>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
