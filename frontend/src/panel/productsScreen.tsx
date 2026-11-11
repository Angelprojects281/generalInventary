import { useState, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import { ArrowLeftRight, Pencil, Plus, Trash2 } from "lucide-react";
import listCategories, { type ClassInterface } from "./listCategories";
import listProviders, {
  type ProviderInterface,
} from "./listProviders";
import deleteProduct from "./deleteProduct";
import FormProduct from "./formProduct";
import FormMovement from "./formMovement";
import RowActions from "./rowActions";
import apiFetch from "../api";
import { useTranslation } from "../i18n";

interface ProductInterface {
  idproducts: number;
  product_code: string;
  product_name: string;
  amount: number;
  description: string;
  category: string;
  provider_name: string;
  purchase_value: number;
  sale_value: number;
}

function buildProductFilters(
  productCode: string,
  categoryName: string,
  amount: number | "",
  providerName: string,
) {
  const filters = new URLSearchParams();
  if (productCode.trim()) filters.set("product_code", productCode.trim());
  if (categoryName) filters.set("categoryName", categoryName);
  if (amount !== "") filters.set("amount", String(amount));
  if (providerName) filters.set("provider_name", providerName);
  return filters;
}

async function loadProducts(
  filters: URLSearchParams,
): Promise<ProductInterface[]> {
  const res = await apiFetch(`/filterProducts?${filters}`);

  const data = await res.json();

  if (!res.ok) {
    console.error("No se pudieron cargar los productos:", data.error);
    return [];
  }

  return data as ProductInterface[];
}

export default function ProductsScreen() {
  const [productsArray, setProductsArray] = useState<ProductInterface[]>([]);
  const [categoryArray, setCategoriesArray] = useState<ClassInterface[]>([]);
  const [providersArray, setProvidersArray] = useState<ProviderInterface[]>([]);
  const [productCode, setProductCode] = useState("");
  const [categoryName, setCategory] = useState("");
  const [providerName, setProviderName] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [showFormNewProduct, setShowFormNewProduct] = useState(false);
  const [showFormNewMovement, setShowFormNewMovement] = useState(false);
  const [productToEdit, setProductToEdit] = useState<ProductInterface | null>(
    null,
  );
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const { t } = useTranslation();

  const fetchProducts = async () => {
    setProductsArray(
      await loadProducts(
        buildProductFilters(productCode, categoryName, amount, providerName),
      ),
    );
  };

  // Las cargas se encadenan con .then para no fijar estado de forma
  // síncrona dentro de los efectos.
  useEffect(() => {
    let isCurrent = true;

    listCategories().then((categories) => {
      if (isCurrent) setCategoriesArray(categories);
    });
    listProviders().then((providers) => {
      if (isCurrent) setProvidersArray(providers);
    });

    return () => {
      isCurrent = false;
    };
  }, []);

  useEffect(() => {
    let isCurrent = true;

    loadProducts(
      buildProductFilters(productCode, categoryName, amount, providerName),
    ).then((products) => {
      if (isCurrent) setProductsArray(products);
    });

    return () => {
      isCurrent = false;
    };
  }, [productCode, categoryName, amount, providerName]);

  const handleCloseForm = () => {
    setShowFormNewProduct(false);
    setShowFormNewMovement(false);
    setProductToEdit(null);
  };

  const successfulManagement = () => {
    setShowFormNewProduct(false);
    setShowFormNewMovement(false);
    setProductToEdit(null);
    fetchProducts();
  };

  const handleDelete = async (product_name: string) => {
    if (await deleteProduct(product_name)) {
      await fetchProducts();
    }
  };

  return (
    <div className="mainScreen">
      <header className="headerScreen headerWithActions">
        <h3 className="tittle">{t("Administrador de productos")}</h3>
        <div className="headerActions">
          <button
            type="button"
            className="actionButton"
            onClick={() => {
              setProductToEdit(null);
              setShowFormNewMovement(false);
              setShowFormNewProduct(true);
            }}
          >
            <Plus size={18} aria-hidden="true" />
            <span>{t("Nuevo producto +")}</span>
          </button>
          <button
            type="button"
            className="actionButton"
            onClick={() => {
              setProductToEdit(null);
              setShowFormNewProduct(false);
              setShowFormNewMovement(true);
            }}
          >
            <ArrowLeftRight size={18} aria-hidden="true" />
            <span>{t("Nuevo movimiento")}</span>
          </button>
        </div>
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
          <span>{t("Filtros")}</span>
          <span>{t(filtersExpanded ? "Ocultar −" : "Mostrar +")}</span>
        </button>
        <input
          className="filterSelect"
          type="text"
          placeholder={t("código único")}
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
          <option value="">{t("seleccione una categoria:")}</option>
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
          <option value="">{t("Todos los proveedores")}</option>
          {providersArray.map((provider) => (
            <option key={provider.idprovider} value={provider.provider_name}>
              {provider.provider_name}
            </option>
          ))}
        </select>
        <input
          className="filterSelect"
          type="number"
          placeholder={t("cantidad menor que")}
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
          {t("Limpiar filtros")}
        </button>
      </section>

      <section className="principalSection">
        <ul className="infoList">
          <li className="lineList">
            <p className="listInfo">{t("Nombre")}</p>
            <p className="listInfo">{t("Cantidad")}</p>
            <p className="listInfo">{t("Venta")}</p>
            <p className="listInfo">{t("Descripcion")}</p>
            <p className="listInfo">{t("Categoria")}</p>
            <p className="listInfo">{t("Proveedor")}</p>
            <p className="listInfo listInfoActions">{t("Accion")}</p>
          </li>
          {productsArray.map((product) => (
            <li
              key={product.idproducts}
              value={product.product_name}
              className="lineList"
            >
              <p className="listInfo lastInfo" data-label={t("Nombre")}>
                {product.product_name}
              </p>
              <p className="listInfo lastInfo" data-label={t("Cantidad")}>
                {product.amount}
              </p>
              <p className="listInfo lastInfo" data-label={t("Venta")}>
                {product.sale_value.toFixed(2)}
              </p>
              <p className="listInfo lastInfo" data-label={t("Descripcion")}>
                {product.description}
              </p>
              <p className="listInfo lastInfo" data-label={t("Categoria")}>
                {product.category}
              </p>
              <p className="listInfo lastInfo" data-label={t("Proveedor")}>
                {product.provider_name}
              </p>
              <div className="lastInfo rowActionsSlot" data-label={t("Accion")}>
                <RowActions
                  actions={[
                    {
                      label: "Editar producto",
                      icon: Pencil,
                      onClick: () => {
                        setProductToEdit(product);
                        setShowFormNewProduct(true);
                      },
                    },
                    {
                      label: "Eliminar producto",
                      icon: Trash2,
                      danger: true,
                      onClick: () => {
                        handleDelete(product.product_name);
                      },
                    },
                  ]}
                />
              </div>
            </li>
          ))}
        </ul>
      </section>
      <AnimatePresence>
        {showFormNewMovement && (
          <FormMovement
            key="movement"
            onAcept={successfulManagement}
            onCancel={handleCloseForm}
          ></FormMovement>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showFormNewProduct && (
          <FormProduct
            key="product"
            onAcept={successfulManagement}
            onCancel={handleCloseForm}
            product={productToEdit ?? undefined}
          ></FormProduct>
        )}
      </AnimatePresence>
    </div>
  );
}
