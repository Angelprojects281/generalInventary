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
  const [initDate, setInitDate] = useState("");
  const [finalDate, setFinalDate] = useState("");
  const [movementsArray, setMovementsArray] = useState<MovementInterface[]>([]);
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

    if (!res.ok) {
      mostrarAlerta("error", "error al obtener productos", "error");
    }

    const data = await res.json();
    setProductsArray(data);
  };

  const filterMovements = async () => {
    const res = await fetch(
      `http://localhost:3000/filterMovements?type=${type}&category_name=${category}&product_name=${product}&initDate=${initDate}&finalDate=${finalDate}`,
      {
        method: "GET",
      },
    );

    const data = await res.json();

    if (!res.ok) {
      mostrarAlerta("error", "error al obtener movimientos", data.error);
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
  }, [type, category, product, initDate, finalDate]);

  return (
    <div className="mainScreen">
      <header className="headerScreen">
        <h3 className="tittle">Administrador de movimientos</h3>
      </header>
      <section className="filterSection">
        <p className="filterText">Filtros:</p>
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
        <p className="filterText">Filtros de fecha (Desde, Hasta):</p>
        <input
          type="date"
          className="filterSelect"
          placeholder="fecha de inicio"
          onChange={(e) => setInitDate(e.target.value)}
        ></input>
        <input
          type="date"
          className="filterSelect"
          placeholder="fecha de inicio"
          onChange={(e) => setFinalDate(e.target.value)}
        ></input>
        <button
          className="filterSelect secundary"
          onClick={() => {
            setType("");
            setCategory("");
            setProduct("");
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
              <p className="listInfo lastInfo">{movement.movement_type}</p>
              <p className="listInfo lastInfo">
                {movement.date_movement.split("T")[0]}
              </p>
              <p className="listInfo lastInfo">{movement.amount}</p>
              <p className="listInfo lastInfo">{movement.category}</p>
              <p className="listInfo lastInfo">{movement.product_name}</p>
              <p className="listInfo lastInfo">{movement.idusers}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
