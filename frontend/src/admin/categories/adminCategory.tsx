import { useState, useEffect } from "react";
import listCategories from "./listCategories";
import FormCategory from "./newCategory";
import deleteCategory from "./deleteCategory";
import { useTranslation } from "../../i18n";

interface ClassInterface {
  idcategoria: number;
  category: string;
}

export default function AdminCategory() {
  const [Category, setCategory] = useState<ClassInterface[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<ClassInterface | null>(
    null,
  );
  const { t } = useTranslation();

  const fetchData = async () => {
    const categories = await listCategories();
    setCategory(categories);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleFormAcept = () => {
    setShowForm(false);
    setCategoryToEdit(null);
    fetchData();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setCategoryToEdit(null);
  };

  return (
    <div className="mainScreen">
      <header className="headerScreen">
        <h3 className="tittle">{t("Administrador de categorias")}</h3>
        <section
          className="actionButton"
          onClick={() => {
            setCategoryToEdit(null);
            setShowForm(true);
          }}
        >
          <p>{t("Nueva categoria +")}</p>
        </section>
      </header>
      <section className="principalSection">
        <ul className="infoList">
          <li className="lineList">
            <p className="listInfo">{t("Numero")}</p>
            <p className="listInfo">{t("Categoria")}</p>
            <p className="listInfo">{t("Editar categoria")}</p>
            <p className="listInfo">{t("Eliminar categoria")}</p>
          </li>
          {Category.map((category, index) => (
            <li
              key={category.idcategoria}
              value={category.idcategoria}
              className="lineList"
            >
              <p className="listInfo lastInfo" data-label={t("Numero")}>
                {index + 1}
              </p>
              <p className="listInfo lastInfo" data-label={t("Categoria")}>
                {category.category}
              </p>
              <p
                className="listInfo lastInfo Update"
                data-label={t("Accion")}
                onClick={() => {
                  setCategoryToEdit(category);
                  setShowForm(true);
                }}
              >
                {t("Editar categoria")}
              </p>
              <p
                className="listInfo lastInfo Delete"
                data-label={t("Accion")}
                onClick={() => {
                  deleteCategory(category.category);
                  fetchData();
                }}
              >
                {t("Eliminar categoria")}
              </p>
            </li>
          ))}
        </ul>
      </section>
      {showForm && (
        <FormCategory
          onAcept={handleFormAcept}
          onCancel={handleFormCancel}
          category={categoryToEdit ?? undefined}
        />
      )}
    </div>
  );
}
