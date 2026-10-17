const API_URL = "http://localhost:3000";

// Todas las llamadas a la API pasan por aquí: adjuntan el JWT de la
// sesión y, si el backend responde 401, cierran la sesión y vuelven
// a la página de bienvenida.
export default async function apiFetch(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });

  if (response.status === 401 && token) {
    localStorage.removeItem("token");
    window.location.replace("/");
  }

  return response;
}
