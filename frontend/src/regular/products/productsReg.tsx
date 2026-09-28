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
  const [categoryName, setCategory] = useState("");
  const [providerName, setProviderName] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [actualProduct, setActualProduct] = useState<ProductInterface | null>(
    null,
  );
  const [showFormNewProduct, setShowFormNewProduct] = useState(false);
  const [showFormNewMovement, setShowFormNewMovement] = useState(false);

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
    if (categoryName) filters.set("categoryName", categoryName);
    if (amount !== "") filters.set("amount", String(amount));
    if (providerName) filters.set("provider_name", providerName);

    const res = await fetch(`http://localhost:3000/filterProducts?${filters}`);

    const data = await res.json();

    if (!res.ok) {
      console.error("Error al obtener productos:", data.error);
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
  }, [categoryName, amount, providerName]);

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
      <section className="filterSection">
        <p className="filterText">Filtros:</p>
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
              <p className="listInfo lastInfo">{product.product_name}</p>
              <p className="listInfo lastInfo">{product.amount}</p>
              <p className="listInfo lastInfo">{product.description}</p>
              <p className="listInfo lastInfo">{product.category}</p>
              <p className="listInfo lastInfo">{product.provider_name}</p>
              <p
                className="listInfo lastInfo Update"
                onClick={() => {
                  setActualProduct(product);
                  setShowFormNewMovement(true);
                }}
              >
                Nuevo movimiento
              </p>
              <p
                className="listInfo lastInfo Delete"
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
