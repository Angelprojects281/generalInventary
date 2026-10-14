import { useState, useEffect } from "react";
import { mostrarAlerta } from "../../alerts/alert";
import deleteUsers from "./deleteUsers";
import FormUsers from "./newUser";
import FormUpdate from "./changePassword";
import { useTranslation } from "../../i18n";

interface usersInterface {
  idusers: string;
  rol: string;
}

export default function AdminUsers() {
  const [rol, setRol] = useState("");
  const [users, setUsers] = useState<usersInterface[]>([]);
  const [showFormUser, setShowForm] = useState(false);
  const [showFormUpdate, setShowFormUpdate] = useState(false);
  const [idUsuario, setIdUsuario] = useState("");
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const { t } = useTranslation();

  const filterUsers = async () => {
    const res = await fetch(`http://localhost:3000/listUsers?rol=${rol}`, {
      method: "GET",
    });
    const data = await res.json();

    if (!res.ok) {
      mostrarAlerta("error", "No se pudieron cargar los usuarios", data.error);
      return;
    }

    setUsers(data);
  };

  useEffect(() => {
    filterUsers();
  }, [rol]);

  const closeForm = () => {
    setShowForm(false);
    setShowFormUpdate(false);
  };

  const usuarioCreado = () => {
    closeForm();
    filterUsers();
  };

  return (
    <div className="mainScreen">
      <header className="headerScreen">
        <h3 className="tittle">{t("Administrador de usuarios")}</h3>
        <section
          className="actionButton"
          onClick={() => {
            setShowForm(true);
          }}
        >
          <p>{t("Nuevo usuario +")}</p>
        </section>
      </header>
      <section
        className={`filterSection userFilterSection ${filtersExpanded ? "filtersExpanded" : ""}`}
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
        <select
          className="filterSelect"
          onChange={(e) => {
            setRol(e.target.value);
          }}
        >
          <option value="">{t("seleccione un rol")}</option>
          <option value="admin">{t("administrador")}</option>
          <option value="regular">{t("regular")}</option>
        </select>
      </section>
      <section className="principalSection">
        <ul className="infoList">
          <li className="lineList">
            <p className="listInfo">{t("Usuario")}</p>
            <p className="listInfo">{t("Rol")}</p>
            <p className="listInfo">{t("Cambiar contraseña")}</p>
            <p className="listInfo">{t("Eliminar usuario")}</p>
          </li>
          {users.map((users) => (
            <li key={users.idusers} value={users.idusers} className="lineList">
              <p className="listInfo lastInfo" data-label={t("Usuario")}>
                {users.idusers}
              </p>
              <p className="listInfo lastInfo" data-label={t("Rol")}>
                {t(users.rol === "admin" ? "administrador" : "regular")}
              </p>
              <p
                className="listInfo lastInfo Update"
                data-label={t("Accion")}
                onClick={() => {
                  setIdUsuario(users.idusers);
                  setShowFormUpdate(true);
                }}
              >
                {t("Cambiar contraseña")}
              </p>
              <p
                className="listInfo lastInfo Delete"
                data-label={t("Accion")}
                onClick={() => {
                  deleteUsers(users.idusers);
                  filterUsers();
                }}
              >
                {t("Eliminar usuario")}
              </p>
            </li>
          ))}
        </ul>
      </section>
      {showFormUser && (
        <FormUsers onAcept={usuarioCreado} onCancel={closeForm} />
      )}

      {showFormUpdate && (
        <FormUpdate
          onAcept={usuarioCreado}
          onCancel={closeForm}
          idUsuario={idUsuario}
        ></FormUpdate>
      )}
    </div>
  );
}
