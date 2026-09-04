import { mostrarAlerta, mostrarConfirmacion } from "../../alerts/alert";
import { jwtDecode } from "jwt-decode";

interface tokenPayload {
  idusers: string;
  rol: string;
  iat: number;
  exp: number;
}

export default async function deleteUsers(idusers: string) {
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
}
