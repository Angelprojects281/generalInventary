import { mostrarAlerta, mostrarConfirmacion } from "../alerts/alert";
import apiFetch from "../api";

export default async function deleteCategory(categoryName: string) {
  const result = await mostrarConfirmacion(
    "question",
    "¿Deseas eliminar esta categoría?",
    "También se eliminarán los productos asociados. Esta acción no se puede deshacer.",
  );

  if (!result.isConfirmed) {
    return false;
  }

  const res = await apiFetch(
    `/deleteCategory/${encodeURIComponent(categoryName)}`,
    {
      method: "DELETE",
    },
  );

  const data = await res.json();

  if (!res.ok) {
    mostrarAlerta("error", "No se pudo eliminar la categoría", data.error);
    return false;
  }

  mostrarAlerta(
    "success",
    "Categoría eliminada",
    `La categoría ${categoryName} se eliminó correctamente.`,
  );
  return true;
}
