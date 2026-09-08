import { mostrarAlerta } from "../../alerts/alert";

export default async function listCategories() {
  const res = await fetch(`http://localhost:3000/listCategories`, {
    method: "GET",
  });

  const data = await res.json();

  if (!res.ok) {
    mostrarAlerta("error", "No se pudieron cargar las categorías", data.error);

    return;
  }

  return data;
}
