import { useState, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import listCategories, { type ClassInterface } from "./listCategories";
import FormCategory from "./formCategory";
import deleteCategory from "./deleteCategory";
import RowActions from "./rowActions";
import { useTranslation } from "../i18n";

export default function CategoriesScreen() {
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

  // La carga inicial se encadena con .then para no fijar estado de forma
  // síncrona dentro del efecto.
  useEffect(() => {
    let isCurrent = true;

    listCategories().then((categories) => {
      if (isCurrent) setCategory(categories);
    });

    return () => {
      isCurrent = false;
    };
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

  const handleDelete = async (categoryName: string) => {
    if (await deleteCategory(categoryName)) {
      await fetchData();
    }
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
          <Plus size={18} aria-hidden="true" />
          <p>{t("Nueva categoria +")}</p>
        </section>
      </header>
      <section className="principalSection">
        <ul className="infoList">
          <li className="lineList">
            <p className="listInfo">{t("Numero")}</p>
            <p className="listInfo">{t("Categoria")}</p>
            <p className="listInfo listInfoActions">{t("Accion")}</p>
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
              <div className="lastInfo rowActionsSlot" data-label={t("Accion")}>
                <RowActions
                  actions={[
                    {
                      label: "Editar categoria",
                      icon: Pencil,
                      onClick: () => {
                        setCategoryToEdit(category);
                        setShowForm(true);
                      },
                    },
                    {
                      label: "Eliminar categoria",
                      icon: Trash2,
                      danger: true,
                      onClick: () => {
                        handleDelete(category.category);
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
        {showForm && (
          <FormCategory
            key="category"
            onAcept={handleFormAcept}
            onCancel={handleFormCancel}
            category={categoryToEdit ?? undefined}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
