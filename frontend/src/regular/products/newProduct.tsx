import { useState, useEffect } from "react";
import { mostrarAlerta } from "../../alerts/alert";
import listCategories from "../../admin/categories/listCategories";
import listProviders, {
  type ProviderInterface,
} from "../../admin/providers/listProviders";

interface formProps {
  onAcept: () => void;
  onCancel: () => void;
}

interface ClassInterface {
  idcategoria: number;
  category: string;
}

function FormProduct({ onAcept, onCancel }: formProps) {
  const [product_name, setProductName] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [categoryName, setCategory] = useState("");
  const [providerName, setProviderName] = useState("");

  const [categotyArray, setCategoriesArray] = useState<ClassInterface[]>([]);
  const [providersArray, setProvidersArray] = useState<ProviderInterface[]>([]);

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
      !product_name ||
      amount === "" ||
      !description ||
      !categoryName ||
      !providerName
    ) {
      mostrarAlerta(
        "error",
        "No se pudo crear el producto",
        "Completa todos los campos antes de continuar.",
      );
      return;
    }
    const res = await fetch("http://localhost:3000/newProduct", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
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

  useEffect(() => {
    fetchCategories();
    fetchProviders();
  }, []);

  return (
    <div className="formContainer">
      <p className="listInfo">Nuevo producto</p>
      <input
        className="userInput"
        placeholder="producto"
        type="text"
        onChange={(e) => {
          setProductName(e.target.value);
        }}
      ></input>
      <input
        className="userInput"
        placeholder="cantidad"
        type="number"
        onChange={(e) => {
          setAmount(Number(e.target.value));
        }}
      ></input>
      <input
        className="userInput"
        placeholder="descripcion"
        type="text"
        onChange={(e) => {
          setDescription(e.target.value);
        }}
      ></input>

      <select
        className="userInput"
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">seleccione una categoria:</option>
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
        <option value="">Seleccione un proveedor:</option>
        {providersArray.map((provider) => (
          <option key={provider.idprovider} value={provider.provider_name}>
            {provider.provider_name}
          </option>
        ))}
      </select>

      <section className="buttonsSection">
        <button className="optionButton" onClick={newProduct}>
          Crear
        </button>
        <button className="optionButton secundary" onClick={onCancel}>
          Cancelar
        </button>
      </section>
    </div>
  );
}

export default FormProduct;
