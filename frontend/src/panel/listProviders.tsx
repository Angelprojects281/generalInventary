import { mostrarAlerta } from "../alerts/alert";
import apiFetch from "../api";

export interface ProviderInterface {
  idprovider: number;
  provider_name: string;
  contact: number;
}

export default async function listProviders(): Promise<ProviderInterface[]> {
  const res = await apiFetch("/listProviders", {
    method: "GET",
  });
  const data = await res.json();

  if (!res.ok) {
    mostrarAlerta("error", "No se pudieron cargar los proveedores", data.error);
    return [];
  }

  return data as ProviderInterface[];
}
