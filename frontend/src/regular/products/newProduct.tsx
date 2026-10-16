import { useState, useEffect } from "react";
import { mostrarAlerta, mostrarConfirmacion } from "../../alerts/alert";
import listCategories from "../../admin/categories/listCategories";
import listProviders, {
  type ProviderInterface,
} from "../../admin/providers/listProviders";
import { useTranslation } from "../../i18n";

interface formProps {
  onAcept: () => void;
  onCancel: () => void;
  product?: {
    idproducts: number;
    product_code: string;
    product_name: string;
    amount: number;
    description: string;
    category: string;
    provider_name: string;
  };
}

interface ClassInterface {
  idcategoria: number;
  category: string;
}

function FormProduct({ onAcept, onCancel, product }: formProps) {
  const [product_code, setProductCode] = useState(
    product?.product_code ?? "",
  );
  const [product_name, setProductName] = useState(
    product?.product_name ?? "",
  );
  const [amount, setAmount] = useState<number | "">(product?.amount ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [categoryName, setCategory] = useState(product?.category ?? "");
  const [providerName, setProviderName] = useState(
    product?.provider_name ?? "",
  );

  const [categotyArray, setCategoriesArray] = useState<ClassInterface[]>([]);
  const [providersArray, setProvidersArray] = useState<ProviderInterface[]>([]);
  const { t } = useTranslation();
  const esEdicion = Boolean(product);

  const fetchCategories = async () => {
    const categoryList = await listCategories();
    setCategoriesArray(categoryList);
  };

  const fetchProviders = async () => {
    const providerList = await listProviders();
    setProvidersArray(providerList);
  };

  const newProduct = async () => {
    if (
      !product_code.trim() ||
      !product_name ||
      amount === "" ||
      !description ||
      !categoryName ||
      !providerName
    ) {
      mostrarAlerta(
        "error",
        "No se pudo crear el producto",
        "Complete todos los campos obligatorios.",
      );
      return;
    }
    const res = await fetch("http://localhost:3000/newProduct", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        product_code: product_code.trim(),
        product_name,
        amount,
        description,
        categoryName,
        provider_name: providerName,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      mostrarAlerta("error", "No se pudo crear el producto", data.error);
      return;
    }
    onAcept();

    mostrarAlerta(
      "success",
      "Producto creado",
      `El producto ${product_name} se creó correctamente.`,
    );
  };

  const editProduct = async () => {
    if (
      !product ||
      !product_code.trim() ||
      !product_name ||
      amount === "" ||
      !description ||
      !categoryName ||
      !providerName
    ) {
      mostrarAlerta(
        "error",
        "No se pudieron guardar los cambios",
        "Complete todos los campos obligatorios.",
      );
      return;
    }

    const result = await mostrarConfirmacion(
      "question",
      "¿Deseas guardar los cambios?",
      "Verifica los datos antes de guardar.",
    );

    if (!result.isConfirmed) {
      return;
    }

    const res = await fetch("http://localhost:3000/updateProduct", {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        idproducts: product.idproducts,
        product_code: product_code.trim(),
        product_name,
        amount,
        description,
        categoryName,
        provider_name: providerName,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      mostrarAlerta("error", "No se pudieron guardar los cambios", data.error);
      return;
    }
    onAcept();

    mostrarAlerta(
      "success",
      "Cambios guardados",
      `El producto ${product_name} se actualizó correctamente.`,
    );
  };

  useEffect(() => {
    fetchCategories();
    fetchProviders();
  }, []);

  return (
    <div className="formContainer">
      <p className="listInfo">
        {esEdicion ? t("Editar producto") : t("Nuevo producto")}
      </p>
      <input
        className="userInput"
        placeholder={t("código único")}
        type="text"
        maxLength={50}
        value={product_code}
        onChange={(e) => setProductCode(e.target.value)}
      />
      <input
        className="userInput"
        placeholder={t("producto")}
        type="text"
        value={product_name}
        onChange={(e) => {
          setProductName(e.target.value);
        }}
      />
      <input
        className="userInput"
        placeholder={t("cantidad")}
        type="number"
        value={amount}
        onChange={(e) => {
          setAmount(Number(e.target.value));
        }}
      ></input>
      <input
        className="userInput"
        placeholder={t("descripcion")}
        type="text"
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
        }}
      ></input>

      <select
        className="userInput"
        value={categoryName}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">{t("seleccione una categoria:")}</option>
        {categotyArray.map((category) => (
          <option key={category.idcategoria} value={category.category}>
            {category.category}
          </option>
        ))}
      </select>

      <select
        className="userInput"
        value={providerName}
        onChange={(e) => setProviderName(e.target.value)}
      >
        <option value="">{t("Seleccione un proveedor:")}</option>
        {providersArray.map((provider) => (
          <option key={provider.idprovider} value={provider.provider_name}>
            {provider.provider_name}
          </option>
        ))}
      </select>

      <section className="buttonsSection">
        <button
          className="optionButton"
          onClick={esEdicion ? editProduct : newProduct}
        >
          {esEdicion ? t("Guardar") : t("Crear")}
        </button>
        <button className="optionButton secundary" onClick={onCancel}>
          {t("Cancelar")}
        </button>
      </section>
    </div>
  );
}

export default FormProduct;
