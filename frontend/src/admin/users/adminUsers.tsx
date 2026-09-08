import { useState, useEffect } from "react";
import { mostrarAlerta } from "../../alerts/alert";
import deleteUsers from "./deleteUsers";
import FormUsers from "./newUser";
import FormUpdate from "./changePassword";

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
        <h3 className="tittle">Administrador de usuarios</h3>
        <section
          className="actionButton"
          onClick={() => {
            setShowForm(true);
          }}
        >
          <p>Nuevo usuario +</p>
        </section>
      </header>
      <section className="filterSection">
        <p className="filterText">Filtros:</p>
        <select
          className="filterSelect"
          onChange={(e) => {
            setRol(e.target.value);
          }}
        >
          <option value="">seleccione un rol</option>
          <option value="admin">administrador</option>
          <option value="regular">regular</option>
        </select>
      </section>
      <section className="principalSection">
        <ul className="infoList">
          <li className="lineList">
            <p className="listInfo">Usuario</p>
            <p className="listInfo">Rol</p>
            <p className="listInfo">Cambiar contraseña</p>
            <p className="listInfo">Eliminar usuario</p>
          </li>
          {users.map((users) => (
            <li key={users.idusers} value={users.idusers} className="lineList">
              <p className="listInfo lastInfo">{users.idusers}</p>
              <p className="listInfo lastInfo">{users.rol}</p>
              <p
                className="listInfo lastInfo Update"
                onClick={() => {
                  setIdUsuario(users.idusers);
                  setShowFormUpdate(true);
                }}
              >
                Cambiar contraseña
              </p>
              <p
                className="listInfo lastInfo Delete"
                onClick={() => {
                  deleteUsers(users.idusers);
                  filterUsers();
                }}
              >
                Eliminar usuario
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
