import { useState, useEffect } from "react";
import listCategories from "./listCategories";
import FormCategory from "./newCategory";
import deleteCategory from "./deleteCategory";

interface ClassInterface {
  idcategoria: number;
  category: string;
}

export default function AdminCategory() {
  const [Category, setCategory] = useState<ClassInterface[]>([]);
  const [showForm, setShowForm] = useState(false);

  const fetchData = async () => {
    const categories = await listCategories();
    setCategory(categories);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleFormAcept = () => {
    setShowForm(false);
    fetchData();
  };

  const handleFormCancel = () => {
    setShowForm(false);
  };

  return (
    <div className="mainScreen">
      <header className="headerScreen">
        <h3 className="tittle">Administrador de categorias</h3>
        <section className="actionButton" onClick={() => setShowForm(true)}>
          <p>Nueva categoria +</p>
        </section>
      </header>
      <section className="principalSection">
        <ul className="infoList">
          <li className="lineList">
            <p className="listInfo">Numero</p>
            <p className="listInfo">Categoria</p>
            <p className="listInfo">Eliminar categoria</p>
          </li>
          {Category.map((category, index) => (
            <li
              key={category.idcategoria}
              value={category.idcategoria}
              className="lineList"
            >
              <p className="listInfo lastInfo">{index + 1}</p>
              <p className="listInfo lastInfo">{category.category}</p>
              <p
                className="listInfo lastInfo Delete"
                onClick={() => {
                  deleteCategory(category.category);
                  fetchData();
                }}
              >
                Eliminar categoria
              </p>
            </li>
          ))}
        </ul>
      </section>
      {showForm && (
        <FormCategory onAcept={handleFormAcept} onCancel={handleFormCancel} />
      )}
    </div>
  );
}
