import { useState, useEffect } from "react";
import listCategories from "../categories/listCategories";
import { mostrarAlerta } from "../../alerts/alert";

interface ClassInterface {
  idcategoria: number;
  category: string;
}

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
  idusers: string;
}

export default function AdminMovements() {
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
  const categories = async () => {
    const categoryList = await listCategories();
    setCategoriesArray(categoryList);
  };

  const filterProducts = async () => {
    const res = await fetch(
      `http://localhost:3000/filterProducts?categoryName=${category}`,
      {
        method: "GET",
      },
    );

    const data = await res.json();

    if (!res.ok) {
      mostrarAlerta("error", "No se pudieron cargar los productos", data.error);
      return;
    }

    setProductsArray(data);
  };

  const filterMovements = async () => {
    const filters = new URLSearchParams();
    if (type) filters.set("type", type);
    if (category) filters.set("category_name", category);
    if (product) filters.set("product_name", product);
    if (productCode.trim()) filters.set("product_code", productCode.trim());
    if (initDate) filters.set("initDate", initDate);
    if (finalDate) filters.set("finalDate", finalDate);

    const res = await fetch(
      `http://localhost:3000/filterMovements?${filters}`,
      { method: "GET" },
    );

    const data = await res.json();

    if (!res.ok) {
      mostrarAlerta(
        "error",
        "No se pudieron cargar los movimientos",
        data.error,
      );
      return;
    }

    setMovementsArray(data);
  };

  useEffect(() => {
    categories();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [category]);

  useEffect(() => {
    filterMovements();
  }, [type, category, product, productCode, initDate, finalDate]);

  return (
    <div className="mainScreen">
      <header className="headerScreen">
        <h3 className="tittle">Administrador de movimientos</h3>
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
          <span>Filtros</span>
          <span>{filtersExpanded ? "Ocultar −" : "Mostrar +"}</span>
        </button>
        <select
          className="filterSelect"
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">seleccione un tipo</option>
          <option value="entrada">entrada</option>
          <option value="salida">salida</option>
        </select>
        <select
          className="filterSelect"
          onChange={(e) => {
            setCategory(e.target.value);
            setProduct("");
          }}
        >
          <option value="">seleccione una categoria:</option>
          {categoriesArray.map((category) => (
            <option key={category.idcategoria} value={category.category}>
              {category.category}
            </option>
          ))}
        </select>
        <select
          className="filterSelect"
          onChange={(e) => setProduct(e.target.value)}
        >
          <option value="">seleccione un producto:</option>
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
          placeholder="código único"
          value={productCode}
          onChange={(e) => setProductCode(e.target.value)}
        />
        <p className="filterText filterLabel movementDateLabel">
          Filtros de fecha (Desde, Hasta):
        </p>
        <input
          type="date"
          className="filterSelect"
          aria-label="Fecha inicial"
          onChange={(e) => setInitDate(e.target.value)}
        />
        <input
          type="date"
          className="filterSelect"
          aria-label="Fecha final"
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
          Limpiar filtros
        </button>
      </section>

      <section className="principalSection">
        <ul className="infoList">
          <li className="lineList">
            <p className="listInfo">Tipo</p>
            <p className="listInfo">Fecha</p>
            <p className="listInfo">Cantidad</p>
            <p className="listInfo">Categoria</p>
            <p className="listInfo">Producto</p>
            <p className="listInfo">Usuario</p>
          </li>
          {movementsArray.map((movement) => (
            <li
              key={movement.idmovements}
              value={movement.idmovements}
              className="lineList"
            >
              <p className="listInfo lastInfo" data-label="Tipo">
                {movement.movement_type}
              </p>
              <p className="listInfo lastInfo" data-label="Fecha">
                {movement.date_movement.split("T")[0]}
              </p>
              <p className="listInfo lastInfo" data-label="Cantidad">
                {movement.amount}
              </p>
              <p className="listInfo lastInfo" data-label="Categoría">
                {movement.category}
              </p>
              <p className="listInfo lastInfo" data-label="Producto">
                {movement.product_name}
              </p>
              <p className="listInfo lastInfo" data-label="Usuario">
                {movement.idusers}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
