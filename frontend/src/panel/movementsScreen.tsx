import { useState, useEffect } from "react";
import listCategories, { type ClassInterface } from "./listCategories";
import apiFetch from "../api";
import { mostrarAlerta } from "../alerts/alert";
import { useTranslation } from "../i18n";

interface ProductInterface {
  idproducts: number;
  product_name: string;
  amount: number;
  description: string;
  idcategoria: number;
}

interface MovementInterface {
  idmovements: number;
  movement_type: string;
  date_movement: string;
  amount: number;
  category: string;
  product_name: string;
}

function buildMovementFilters(
  type: string,
  category: string,
  product: string,
  productCode: string,
  initDate: string,
  finalDate: string,
) {
  const filters = new URLSearchParams();
  if (type) filters.set("type", type);
  if (category) filters.set("category_name", category);
  if (product) filters.set("product_name", product);
  if (productCode.trim()) filters.set("product_code", productCode.trim());
  if (initDate) filters.set("initDate", initDate);
  if (finalDate) filters.set("finalDate", finalDate);
  return filters;
}

async function loadProductsByCategory(
  category: string,
): Promise<ProductInterface[]> {
  const res = await apiFetch(
    `/filterProducts?categoryName=${encodeURIComponent(category)}`,
    {
      method: "GET",
    },
  );

  const data = await res.json();

  if (!res.ok) {
    mostrarAlerta("error", "No se pudieron cargar los productos", data.error);
    return [];
  }

  return data as ProductInterface[];
}

async function loadMovements(
  filters: URLSearchParams,
): Promise<MovementInterface[]> {
  const res = await apiFetch(`/filterMovements?${filters}`, {
    method: "GET",
  });

  const data = await res.json();

  if (!res.ok) {
    mostrarAlerta(
      "error",
      "No se pudieron cargar los movimientos",
      data.error,
    );
    return [];
  }

  return data as MovementInterface[];
}

export default function MovementsScreen() {
  const [type, setType] = useState("");
  const [categoriesArray, setCategoriesArray] = useState<ClassInterface[]>([]);
  const [category, setCategory] = useState("");
  const [productsArray, setProductsArray] = useState<ProductInterface[]>([]);
  const [product, setProduct] = useState("");
  const [productCode, setProductCode] = useState("");
  const [initDate, setInitDate] = useState("");
  const [finalDate, setFinalDate] = useState("");
  const [movementsArray, setMovementsArray] = useState<MovementInterface[]>([]);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const { t } = useTranslation();

  // Las cargas se encadenan con .then para no fijar estado de forma
  // síncrona dentro de los efectos.
  useEffect(() => {
    let isCurrent = true;

    listCategories().then((categories) => {
      if (isCurrent) setCategoriesArray(categories);
    });

    return () => {
      isCurrent = false;
    };
  }, []);

  useEffect(() => {
    let isCurrent = true;

    loadProductsByCategory(category).then((products) => {
      if (isCurrent) setProductsArray(products);
    });

    return () => {
      isCurrent = false;
    };
  }, [category]);

  useEffect(() => {
    let isCurrent = true;

    loadMovements(
      buildMovementFilters(
        type,
        category,
        product,
        productCode,
        initDate,
        finalDate,
      ),
    ).then((movements) => {
      if (isCurrent) setMovementsArray(movements);
    });

    return () => {
      isCurrent = false;
    };
  }, [type, category, product, productCode, initDate, finalDate]);

  return (
    <div className="mainScreen">
      <header className="headerScreen">
        <h3 className="tittle">{t("Administrador de movimientos")}</h3>
      </header>
      <section
        className={`filterSection movementFilterSection ${filtersExpanded ? "filtersExpanded" : ""}`}
      >
        <button
          className="filterToggle"
          type="button"
          aria-expanded={filtersExpanded}
          onClick={() => setFiltersExpanded((expanded) => !expanded)}
        >
          <span>{t("Filtros")}</span>
          <span>{t(filtersExpanded ? "Ocultar −" : "Mostrar +")}</span>
        </button>
        <select
          className="filterSelect"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">{t("seleccione un tipo")}</option>
          <option value="entrada">{t("entrada")}</option>
          <option value="salida">{t("salida")}</option>
        </select>
        <select
          className="filterSelect"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setProduct("");
          }}
        >
          <option value="">{t("seleccione una categoria:")}</option>
          {categoriesArray.map((category) => (
            <option key={category.idcategoria} value={category.category}>
              {category.category}
            </option>
          ))}
        </select>
        <select
          className="filterSelect"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
        >
          <option value="">{t("seleccione un producto:")}</option>
          {productsArray.map((productName) => (
            <option
              key={productName.idproducts}
              value={productName.product_name}
            >
              {productName.product_name}
            </option>
          ))}
        </select>
        <input
          className="filterSelect"
          type="text"
          placeholder={t("código único")}
          value={productCode}
          onChange={(e) => setProductCode(e.target.value)}
        />
        <p className="filterText filterLabel movementDateLabel">
          {t("Filtros de fecha (Desde, Hasta):")}
        </p>
        <input
          type="date"
          className="filterSelect"
          aria-label={t("Fecha inicial")}
          value={initDate}
          onChange={(e) => setInitDate(e.target.value)}
        />
        <input
          type="date"
          className="filterSelect"
          aria-label={t("Fecha final")}
          value={finalDate}
          onChange={(e) => setFinalDate(e.target.value)}
        />
        <button
          className="filterSelect secundary"
          onClick={() => {
            setType("");
            setCategory("");
            setProduct("");
            setProductCode("");
            setInitDate("");
            setFinalDate("");
          }}
        >
          {t("Limpiar filtros")}
        </button>
      </section>

      <section className="principalSection">
        <ul className="infoList">
          <li className="lineList">
            <p className="listInfo">{t("Tipo")}</p>
            <p className="listInfo">{t("Fecha")}</p>
            <p className="listInfo">{t("Cantidad")}</p>
            <p className="listInfo">{t("Categoria")}</p>
            <p className="listInfo">{t("Producto")}</p>
          </li>
          {movementsArray.map((movement) => (
            <li
              key={movement.idmovements}
              value={movement.idmovements}
              className="lineList"
            >
              <p className="listInfo lastInfo" data-label={t("Tipo")}>
                {t(movement.movement_type)}
              </p>
              <p className="listInfo lastInfo" data-label={t("Fecha")}>
                {movement.date_movement.split("T")[0]}
              </p>
              <p className="listInfo lastInfo" data-label={t("Cantidad")}>
                {movement.amount}
              </p>
              <p className="listInfo lastInfo" data-label={t("Categoria")}>
                {movement.category}
              </p>
              <p className="listInfo lastInfo" data-label={t("Producto")}>
                {movement.product_name}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
