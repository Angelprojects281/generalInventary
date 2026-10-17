import { mostrarAlerta } from "../alerts/alert";
import apiFetch from "../api";

export interface ClassInterface {
  idcategoria: number;
  category: string;
}

export default async function listCategories(): Promise<ClassInterface[]> {
  const res = await apiFetch("/listCategories", {
    method: "GET",
  });

  const data = await res.json();

  if (!res.ok) {
    mostrarAlerta("error", "No se pudieron cargar las categorías", data.error);

    return [];
  }

  return data as ClassInterface[];
}
