import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Trash2 } from "lucide-react";
import { mostrarAlerta, mostrarConfirmacionDetalle, type ResumenDetalle } from "../alerts/alert";
import apiFetch from "../api";
import { useTranslation } from "../i18n";

interface formProps {
  onAcept: () => void;
  onCancel: () => void;
}

// Producto devuelto por /filterProducts: amount es el stock actual.
interface SearchProductInterface {
  idproducts: number;
  product_code: string;
  product_name: string;
  amount: number;
  purchase_value: number;
  sale_value: number;
}

// Línea del movimiento en el composer: amount es la cantidad elegida
// (vacía mientras el usuario la escribe) y stock el stock al añadirla.
interface MovementItemInterface {
  idproducts: number;
  product_name: string;
  product_code: string;
  amount: number | "";
  stock: number;
  purchase_value: number;
  sale_value: number;
}

type MovementType = "" | "entrada" | "salida";

// Valor unitario que se aplicará a la línea según el tipo de movimiento.
// Es la misma regla que usa el backend al congelar el valor unitario.
function unitValueFor(
  item: MovementItemInterface,
  type: MovementType,
): number | null {
  if (type === "entrada") return item.purchase_value;
  if (type === "salida") return item.sale_value;
  return null;
}

// Total estimado del movimiento: suma de cantidad x valor unitario.
// Se redondea a dos decimales al final para evitar el ruido de coma
// flotante (los valores del producto son DECIMAL(12,2)).
function calculateMovementTotal(
  items: MovementItemInterface[],
  type: MovementType,
): number {
  if (type !== "entrada" && type !== "salida") return 0;

  const sum = items.reduce((acc, item) => {
    const amount = item.amount;
    if (amount === "" || !Number.isFinite(amount) || amount <= 0) return acc;
    const unit = unitValueFor(item, type);
    if (unit === null) return acc;
    return acc + amount * unit;
  }, 0);

  return Math.round(sum * 100) / 100;
}

// Importe de una línea: cantidad x valor unitario, redondeado a céntimos
// igual que hace el backend al guardar el detalle del movimiento.
function lineTotalFor(
  item: MovementItemInterface,
  type: MovementType,
): number {
  const unit = unitValueFor(item, type);
  if (unit === null || item.amount === "") return 0;
  return Math.round(item.amount * unit * 100) / 100;
}

// Búsqueda combinada: código exacto y nombre parcial, como en
// productsScreen. Si no hay texto no se consulta la API.
async function searchProducts(
  productCode: string,
  productName: string,
): Promise<SearchProductInterface[]> {
  if (!productCode && !productName) return [];

  const filters = new URLSearchParams();
  if (productCode) filters.set("product_code", productCode);
  if (productName) filters.set("product_name", productName);

  const res = await apiFetch(`/filterProducts?${filters}`, {
    method: "GET",
  });

  const data = await res.json();

  if (!res.ok) {
    mostrarAlerta("error", "No se pudieron cargar los productos", data.error);

    return [];
  }

  return data as SearchProductInterface[];
}

function FormMovement({ onAcept, onCancel }: formProps) {
  const [type, setType] = useState<MovementType>("");
  const [codeQuery, setCodeQuery] = useState("");
  const [nameQuery, setNameQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    SearchProductInterface[]
  >([]);
  const [items, setItems] = useState<MovementItemInterface[]>([]);
  const { t } = useTranslation();

  // Total en vivo: valor derivado del estado durante el render (no es
  // estado nuevo ni efecto), recalculado en cada pulsación del teclado.
  const total = calculateMovementTotal(items, type);

  // Las cargas se encadenan con .then para no fijar estado de forma
  // síncrona dentro del efecto; sin texto la búsqueda resuelve [] y
  // quedan limpios los resultados.
  useEffect(() => {
    let isCurrent = true;

    searchProducts(codeQuery.trim(), nameQuery.trim()).then((results) => {
      if (isCurrent) setSearchResults(results);
    });

    return () => {
      isCurrent = false;
    };
  }, [codeQuery, nameQuery]);

  // Si el producto ya está en el movimiento se fusiona sumando una
  // unidad más (una sola línea por producto, decisión del usuario).
  const addProduct = (product: SearchProductInterface) => {
    const existing = items.find(
      (item) => item.idproducts === product.idproducts,
    );
    let nextAmount = 1;

    if (existing && existing.amount !== "") {
      nextAmount = existing.amount + 1;
    }

    // Aviso al añadir: en salida no se admiten más unidades de las
    // disponibles.
    if (type === "salida" && nextAmount > product.amount) {
      mostrarAlerta(
        "error",
        "No se pudo registrar el movimiento",
        "No hay existencias suficientes para registrar la salida.",
      );
      return;
    }

    if (existing) {
      setItems((current) =>
        current.map((item) =>
          item.idproducts === product.idproducts
            ? {
                ...item,
                amount: nextAmount,
                stock: product.amount,
                purchase_value: product.purchase_value,
                sale_value: product.sale_value,
              }
            : item,
        ),
      );
      return;
    }

    setItems((current) => [
      ...current,
      {
        idproducts: product.idproducts,
        product_name: product.product_name,
        product_code: product.product_code,
        amount: 1,
        stock: product.amount,
        purchase_value: product.purchase_value,
        sale_value: product.sale_value,
      },
    ]);
  };

  const setLineAmount = (idproducts: number, value: string) => {
    setItems((current) =>
      current.map((item) =>
        item.idproducts === idproducts
          ? { ...item, amount: value === "" ? "" : Number(value) }
          : item,
      ),
    );
  };

  const removeItem = (idproducts: number) => {
    setItems((current) =>
      current.filter((item) => item.idproducts !== idproducts),
    );
  };

  const newMovement = async () => {
    const errorTitle = "No se pudo registrar el movimiento";

    if (!type) {
      mostrarAlerta(
        "error",
        errorTitle,
        "Complete los datos obligatorios del movimiento.",
      );
      return;
    }

    if (items.length === 0) {
      mostrarAlerta(
        "error",
        errorTitle,
        "Añade al menos un producto al movimiento.",
      );
      return;
    }

    // Revalidación completa antes de enviar: cantidades enteras y, en
    // salida, existencias suficientes por línea.
    for (const item of items) {
      if (
        item.amount === "" ||
        !Number.isInteger(item.amount) ||
        item.amount < 1
      ) {
        mostrarAlerta("error", errorTitle, "Ingrese una cantidad mayor que cero.");
        return;
      }

      if (type === "salida" && item.amount > item.stock) {
        mostrarAlerta(
          "error",
          errorTitle,
          "No hay existencias suficientes para registrar la salida.",
        );
        return;
      }
    }

    // Confirmación antes de enviar: se muestra el resumen del movimiento
    // (tipo, una fila por línea con producto, cantidad, valor e importe y el
    // total). Si el usuario cancela, no se envía nada y el composer conserva
    // su estado. El resumen se construye aquí, dentro del manejador.
    const detalle: ResumenDetalle = {
      tipo:
        type === "salida" ? "Movimiento de salida" : "Movimiento de entrada",
      cabecera: ["Producto", "Cantidad", "Valor", "Importe"],
      filas: items.map((item) => [
        `${item.product_name} (${item.product_code})`,
        String(item.amount),
        (unitValueFor(item, type) ?? 0).toFixed(2),
        lineTotalFor(item, type).toFixed(2),
      ]),
      total: { etiqueta: "Total", valor: total.toFixed(2) },
      nota:
        type === "salida"
          ? "Al confirmar se descontarán las unidades del stock de los productos."
          : "Al confirmar se sumarán las unidades al stock de los productos.",
    };

    const resultado = await mostrarConfirmacionDetalle(
      "question",
      "¿Deseas registrar el movimiento?",
      detalle,
    );

    if (!resultado.isConfirmed) {
      return;
    }

    const res = await apiFetch("/newMovement", {
      method: "POST",
      body: JSON.stringify({
        type,
        items: items.map((item) => ({
          idproducts: item.idproducts,
          amount: item.amount,
        })),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      mostrarAlerta("error", errorTitle, data.error);
      return;
    }

    onAcept();

    mostrarAlerta(
      "success",
      "Movimiento registrado",
      `Movimiento registrado correctamente. Total: ${total.toFixed(2)}`,
    );
  };

  // Alerta local durante la composición (sin enviar): en salida alguna
  // línea pide más unidades de las que hay en stock.
  const stockExceeded =
    type === "salida" &&
    items.some((item) => item.amount !== "" && item.amount > item.stock);

  return (
    <motion.div
      className="formContainer movementComposer"
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.97 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      <p className="listInfo">{t("Nuevo movimiento")}</p>

      <select
        className="userInput"
        value={type}
        onChange={(e) => setType(e.target.value as MovementType)}
      >
        <option value="">{t("seleccione el tipo:")}</option>
        <option value="entrada">{t("Entrada")}</option>
        <option value="salida">{t("Salida")}</option>
      </select>

      <input
        className="userInput"
        placeholder={t("código único")}
        type="text"
        maxLength={50}
        value={codeQuery}
        onChange={(e) => setCodeQuery(e.target.value)}
      />
      <input
        className="userInput"
        placeholder={t("nombre del producto")}
        type="text"
        value={nameQuery}
        onChange={(e) => setNameQuery(e.target.value)}
      />

      <section className="movementBlock movementResults">
        {searchResults.length > 0 ? (
          <>
            <div className="movementLineHead movementResultHead">
              <p className="movementCell movementHeadCell">{t("Nombre")}</p>
              <p className="movementCell movementHeadCell">{t("Código")}</p>
              <p className="movementCell movementHeadCell">{t("Stock")}</p>
              <p className="movementCell movementHeadCell">{t("Accion")}</p>
            </div>
            {searchResults.map((product) => (
              <div className="movementResultRow" key={product.idproducts}>
                <p className="movementCell" data-label={t("Nombre")}>
                  {product.product_name}
                </p>
                <p className="movementCell" data-label={t("Código")}>
                  {product.product_code}
                </p>
                <p className="movementCell" data-label={t("Stock")}>
                  {product.amount}
                </p>
                <button
                  type="button"
                  className="movementAddButton"
                  onClick={() => addProduct(product)}
                >
                  {t("Añadir")}
                </button>
              </div>
            ))}
          </>
        ) : (
          <p className="movementEmpty">
            {codeQuery.trim() || nameQuery.trim()
              ? t("No se encontraron productos.")
              : t("Busca un producto por código o nombre.")}
          </p>
        )}
      </section>

      {stockExceeded && (
        <p className="movementBlock movementWarning" role="status">
          {t("No hay existencias suficientes para registrar la salida.")}
        </p>
      )}

      <section className="movementBlock movementLines">
        <div className="movementLineHead">
          <p className="movementCell movementHeadCell">{t("Nombre")}</p>
          <p className="movementCell movementHeadCell">{t("Código")}</p>
          <p className="movementCell movementHeadCell">{t("Stock")}</p>
          <p className="movementCell movementHeadCell">{t("Cantidad")}</p>
          <p className="movementCell movementHeadCell">{t("Valor")}</p>
          <p className="movementCell movementHeadCell">{t("Accion")}</p>
        </div>

        {items.length === 0 ? (
          <p className="movementEmpty">
            {t("Añade al menos un producto al movimiento.")}
          </p>
        ) : (
          items.map((item) => {
            const overStock =
              type === "salida" &&
              item.amount !== "" &&
              item.amount > item.stock;
            const unitValue = unitValueFor(item, type);

            return (
              <div
                className={`movementLine${overStock ? " movementLineInvalid" : ""}`}
                key={item.idproducts}
              >
                <p className="movementCell" data-label={t("Nombre")}>
                  {item.product_name}
                </p>
                <p className="movementCell" data-label={t("Código")}>
                  {item.product_code}
                </p>
                <p className="movementCell" data-label={t("Stock")}>
                  {item.stock}
                </p>
                <p className="movementCell" data-label={t("Cantidad")}>
                  <input
                    className="movementQuantity"
                    type="number"
                    min="1"
                    value={item.amount}
                    aria-label={`${t("cantidad")}: ${item.product_name}`}
                    onChange={(e) =>
                      setLineAmount(item.idproducts, e.target.value)
                    }
                  />
                </p>
                <p className="movementCell" data-label={t("Valor")}>
                  {unitValue === null ? "—" : unitValue.toFixed(2)}
                </p>
                <div
                  className="movementCell movementRemoveCell"
                  data-label={t("Accion")}
                >
                  <button
                    type="button"
                    className="movementRemoveButton"
                    aria-label={t("Quitar")}
                    title={t("Quitar")}
                    onClick={() => removeItem(item.idproducts)}
                  >
                    <Trash2 size={18} aria-hidden="true" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </section>

      <section className="movementBlock movementTotalBar">
        <div className="movementTotalInfo">
          <p className="movementTotalLabel">{t("Total del movimiento")}</p>
          <p className="movementTotalHint">
            {type === "salida"
              ? t("Calculado con el valor de venta de cada producto.")
              : type === "entrada"
                ? t("Calculado con el valor de compra de cada producto.")
                : t("Selecciona el tipo de movimiento para ver el total.")}
          </p>
        </div>
        <p
          className={`movementTotalValue${
            type === "salida" ? " historyGain" : type === "entrada" ? " historyLoss" : ""
          }`}
          aria-live="polite"
        >
          {type ? total.toFixed(2) : "—"}
        </p>
      </section>

      <section className="buttonsSection">
        <button className="optionButton" onClick={newMovement}>
          {t("Crear")}
        </button>
        <button className="optionButton secundary" onClick={onCancel}>
          {t("Cancelar")}
        </button>
      </section>
    </motion.div>
  );
}

export default FormMovement;
