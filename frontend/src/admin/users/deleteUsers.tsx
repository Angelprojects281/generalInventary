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
    "Revisa la información antes de continuar. Esta acción no se puede deshacer.",
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
    mostrarAlerta("error", "No se pudo eliminar el usuario", data.error);
    return;
  }

  mostrarAlerta(
    "success",
    "Usuario eliminado",
    `El usuario ${idusers} se eliminó correctamente.`,
  );
}
