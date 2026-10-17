import { mostrarAlerta, mostrarConfirmacion } from "../alerts/alert";
import apiFetch from "../api";

export default async function deleteProvider(providerName: string) {
  const result = await mostrarConfirmacion(
    "question",
    "¿Deseas eliminar este proveedor?",
    "También se eliminarán los productos asociados. Esta acción no se puede deshacer.",
  );

  if (!result.isConfirmed) return false;

  const res = await apiFetch(
    `/deleteProvider/${encodeURIComponent(providerName)}`,
    { method: "DELETE" },
  );
  const data = await res.json();

  if (!res.ok) {
    mostrarAlerta("error", "No se pudo eliminar el proveedor", data.error);
    return false;
  }

  mostrarAlerta(
    "success",
    "Proveedor eliminado",
    `El proveedor ${providerName} y sus productos asociados se eliminaron.`,
  );
  return true;
}
