import { mostrarAlerta, mostrarConfirmacion } from "../../alerts/alert";

export default async function deleteProvider(providerName: string) {
  const result = await mostrarConfirmacion(
    "question",
    "¿Deseas eliminar este proveedor?",
    "También se eliminarán los productos asociados. Esta acción no se puede deshacer.",
  );

  if (!result.isConfirmed) return false;

  const res = await fetch(
    `http://localhost:3000/deleteProvider/${encodeURIComponent(providerName)}`,
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
