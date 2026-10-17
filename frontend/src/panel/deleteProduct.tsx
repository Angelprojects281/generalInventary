import { mostrarAlerta, mostrarConfirmacion } from "../alerts/alert";
import apiFetch from "../api";

export default async function deleteProduct(product_name: string) {
  const result = await mostrarConfirmacion(
    "question",
    "¿Deseas eliminar este producto?",
    "Revisa la información antes de continuar. Esta acción no se puede deshacer.",
  );

  if (!result.isConfirmed) {
    return false;
  }

  const res = await apiFetch(
    `/deleteProduct/${encodeURIComponent(product_name)}`,
    {
      method: "DELETE",
    },
  );

  const data = await res.json();
  if (!res.ok) {
    mostrarAlerta("error", "No se pudo eliminar el producto", data.error);
    return false;
  }

  mostrarAlerta("success", "Producto eliminado", data.message);
  return true;
}
