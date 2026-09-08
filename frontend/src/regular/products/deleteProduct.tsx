import { mostrarAlerta, mostrarConfirmacion } from "../../alerts/alert";

export default async function deleteProduct(product_name: string) {
  const result = await mostrarConfirmacion(
    "question",
    "¿Deseas eliminar este producto?",
    "Revisa la información antes de continuar. Esta acción no se puede deshacer.",
  );

  if (!result.isConfirmed) {
    return;
  }

  const res = await fetch(
    `http://localhost:3000/deleteProduct/${product_name}`,
    {
      method: "DELETE",
    },
  );

  const data = await res.json();
  if (!res.ok) {
    mostrarAlerta("error", "No se pudo eliminar el producto", data.error);
    return;
  }

  mostrarAlerta("success", "Producto eliminado", data.message);
}
