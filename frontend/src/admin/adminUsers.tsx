import { useState, useEffect } from "react";
import { mostrarAlerta, mostrarConfirmacion } from "../alerts/alert";
import { jwtDecode } from "jwt-decode";

interface usersInterface {
  idusers: string;
  rol: string;
}

interface tokenPayload {
  idusers: string;
  rol: string;
  iat: number;
  exp: number;
}

export default function AdminUsers() {
  const [rol, setRol] = useState("");
  const [users, setUsers] = useState<usersInterface[]>([]);

  const filterUsers = async () => {
    const res = await fetch(`http://localhost:3000/listUsers?rol=${rol}`, {
      method: "GET",
    });
    const data = await res.json();

    if (!res.ok) {
      mostrarAlerta("error", "error al obtener usuarios", data.error);
    }

    setUsers(data);
  };

  useEffect(() => {
    filterUsers();
  }, [rol]);

  const handleDeleteUser = async (idusers: string) => {
    const tokenLocal = localStorage.getItem("token");

    if (tokenLocal === null) {
      return;
    }

    const decodeToken = jwtDecode<tokenPayload>(tokenLocal);

    const result = await mostrarConfirmacion(
      "question",
      "¿Deseas eliminar este usuario?",
      "revise nuevamente la informacion antes de continuar",
    );

    if (!result.isConfirmed) {
      return;
    }
    const res = await fetch(
      `http://localhost:3000/deleteUser/${idusers}/${decodeToken.idusers}`,
      {
        method: "DELETE",
      },
    );

    const data = await res.json();

    if (!res.ok) {
      mostrarAlerta("error", "Error al eliminar usuario", data.error);
      return;
    }

    mostrarAlerta(
      "success",
      "usuarios eliminado correctamente",
      `se elimino el usuario ${idusers}`,
    );
    filterUsers();
  };

  return (
    <div className="mainScreen">
      <header className="headerScreen">
        <h3 className="tittle">Administrador de usuarios</h3>
        <section className="actionButton">
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
            <p className="listInfo">Eliminar usuario</p>
          </li>
          {users.map((users) => (
            <li key={users.idusers} value={users.idusers} className="lineList">
              <p className="listInfo lastInfo">{users.idusers}</p>
              <p className="listInfo lastInfo">{users.rol}</p>
              <p
                className="listInfo lastInfo Delete"
                onClick={() => {
                  handleDeleteUser(users.idusers);
                }}
              >
                Eliminar usuario
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
