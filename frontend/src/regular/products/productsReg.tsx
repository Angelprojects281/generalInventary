import { useState, useEffect } from "react";
import listCategories from "../../admin/categories/listCategories";
import listProviders, {
  type ProviderInterface,
} from "../../admin/providers/listProviders";
import deleteProduct from "./deleteProduct";
import FormProduct from "./newProduct";
import FormMovement from "../movements/newMovement";

interface ProductInterface {
  idproducts: number;
  product_name: string;
  amount: number;
  description: string;
  category: string;
  provider_name: string;
}

interface ClassInterface {
  idcategoria: number;
  category: string;
}

export default function ProductsReg() {
  const [productsArray, setProductsArray] = useState<ProductInterface[]>([]);
  const [categoryArray, setCategoriesArray] = useState<ClassInterface[]>([]);
  const [providersArray, setProvidersArray] = useState<ProviderInterface[]>([]);
  const [productCode, setProductCode] = useState("");
  const [categoryName, setCategory] = useState("");
  const [providerName, setProviderName] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [actualProduct, setActualProduct] = useState<ProductInterface | null>(
    null,
  );
  const [showFormNewProduct, setShowFormNewProduct] = useState(false);
  const [showFormNewMovement, setShowFormNewMovement] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  const fetchCategories = async () => {
    const categoryList = await listCategories();
    setCategoriesArray(categoryList);
  };

  const fetchProviders = async () => {
    const providerList = await listProviders();
    setProvidersArray(providerList);
  };

  const fetchProducts = async () => {
    const filters = new URLSearchParams();
    if (productCode.trim()) filters.set("product_code", productCode.trim());
    if (categoryName) filters.set("categoryName", categoryName);
    if (amount !== "") filters.set("amount", String(amount));
    if (providerName) filters.set("provider_name", providerName);

    const res = await fetch(`http://localhost:3000/filterProducts?${filters}`);

    const data = await res.json();

    if (!res.ok) {
      console.error("No se pudieron cargar los productos:", data.error);
      return;
    }
    setProductsArray(data);
  };

  useEffect(() => {
    fetchCategories();
    fetchProviders();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [productCode, categoryName, amount, providerName]);

  const handleCloseForm = () => {
    setShowFormNewProduct(false);
    setShowFormNewMovement(false);
  };

  const successfulCreation = () => {
    setShowFormNewProduct(false);
    setShowFormNewMovement(false);
    fetchProducts();
  };

  return (
    <div className="mainScreen">
      <header className="headerScreen">
        <h3 className="tittle">Administrador de productos</h3>
        <section
          className="actionButton"
          onClick={() => setShowFormNewProduct(true)}
        >
          <p>Nuevo producto +</p>
        </section>
      </header>
      <section
        className={`filterSection productFilterSection ${filtersExpanded ? "filtersExpanded" : ""}`}
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
        <input
          className="filterSelect"
          type="text"
          placeholder="código único"
          value={productCode}
          onChange={(e) => setProductCode(e.target.value)}
        />
        <select
          className="filterSelect"
          value={categoryName}
          onChange={(e) => {
            setCategory(e.target.value);
          }}
        >
          <option value="">seleccione una categoria:</option>
          {categoryArray.map((category) => (
            <option key={category.idcategoria} value={category.category}>
              {category.category}
            </option>
          ))}
        </select>
        <select
          className="filterSelect"
          value={providerName}
          onChange={(e) => setProviderName(e.target.value)}
        >
          <option value="">Todos los proveedores</option>
          {providersArray.map((provider) => (
            <option key={provider.idprovider} value={provider.provider_name}>
              {provider.provider_name}
            </option>
          ))}
        </select>
        <input
          className="filterSelect"
          type="number"
          placeholder="cantidad menor que"
          onChange={(e) => {
            setAmount(e.target.value === "" ? "" : Number(e.target.value));
          }}
        ></input>

        <button
          className="filterSelect secundary"
          onClick={() => {
            setCategory("");
            setProviderName("");
            setAmount("");
            setProductCode("");
          }}
        >
          Limpiar filtros
        </button>
      </section>

      <section className="principalSection">
        <ul className="infoList">
          <li className="lineList">
            <p className="listInfo">Nombre</p>
            <p className="listInfo">Cantidad</p>
            <p className="listInfo">Descripcion</p>
            <p className="listInfo">Categoria</p>
            <p className="listInfo">Proveedor</p>
            <p className="listInfo">Nuevo movimiento</p>
            <p className="listInfo">Eliminar producto</p>
          </li>
          {productsArray.map((product) => (
            <li
              key={product.idproducts}
              value={product.product_name}
              className="lineList"
            >
              <p className="listInfo lastInfo" data-label="Nombre">
                {product.product_name}
              </p>
              <p className="listInfo lastInfo" data-label="Cantidad">
                {product.amount}
              </p>
              <p className="listInfo lastInfo" data-label="Descripción">
                {product.description}
              </p>
              <p className="listInfo lastInfo" data-label="Categoría">
                {product.category}
              </p>
              <p className="listInfo lastInfo" data-label="Proveedor">
                {product.provider_name}
              </p>
              <p
                className="listInfo lastInfo Update"
                data-label="Acción"
                onClick={() => {
                  setActualProduct(product);
                  setShowFormNewMovement(true);
                }}
              >
                Nuevo movimiento
              </p>
              <p
                className="listInfo lastInfo Delete"
                data-label="Acción"
                onClick={() => {
                  deleteProduct(product.product_name);
                  fetchProducts();
                }}
              >
                Eliminar producto
              </p>
            </li>
          ))}
        </ul>
        {showFormNewMovement && actualProduct && (
          <FormMovement
            onAcept={successfulCreation}
            onCancel={handleCloseForm}
            category_name={actualProduct?.category}
            product_name={actualProduct?.product_name}
          ></FormMovement>
        )}
      </section>
      {showFormNewProduct && (
        <FormProduct
          onAcept={successfulCreation}
          onCancel={handleCloseForm}
        ></FormProduct>
      )}
    </div>
  );
}
