import { mostrarAlerta, mostrarConfirmacion } from "../../alerts/alert";

export default async function deleteCategory(categoryName: string) {
  const result = await mostrarConfirmacion(
    "question",
    "¿Deseas eliminar esta categoria?",
    "revise nuevamente la informacion antes de continuar",
  );

  if (!result.isConfirmed) {
    return;
  }

  const res = await fetch(
    `http://localhost:3000/deleteCategory/${categoryName}`,
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
    "categoria eliminada correctamente",
    `se elimino la categoria ${categoryName}`,
  );
}
