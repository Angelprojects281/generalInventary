// Utilidades del atajo de teclado para añadir productos escaneados.
// Sin JSX ni componentes (patrón de reportBuilder.ts) → no activa
// react-refresh/only-export-components.

// Catálogo de atajos: teclas individuales y combinaciones con modificadores.
// Todas son capturables dentro de un input de texto sin romper la escritura
// (ninguna es imprimible y ninguna está reservada por el navegador).
export interface ShortcutOption {
  id: string; // valor técnico: se guarda y se compara con la pulsación
  label: string; // etiqueta visible en el desplegable
}

export const SHORTCUT_OPTIONS: ShortcutOption[] = [
  { id: "F2", label: "F2" },
  { id: "F4", label: "F4" },
  { id: "F8", label: "F8" },
  { id: "F9", label: "F9" },
  { id: "Enter", label: "Enter" },
  { id: "Ctrl+Enter", label: "Ctrl + Enter" },
  { id: "Alt+Enter", label: "Alt + Enter" },
  { id: "Ctrl+Shift+Enter", label: "Ctrl + Shift + Enter" },
  { id: "", label: "" }, // desactivado (la etiqueta la pone la pantalla)
];

export const DEFAULT_SHORTCUT = "F2";
export const SHORTCUT_STORAGE_KEY = "inventario-movement-shortcut";

// Lee la preferencia guardada. Si el valor no está en el catálogo (corrupto o
// de otra versión) se devuelve el valor por defecto.
export function readStoredShortcut(): string {
  try {
    const guardado = localStorage.getItem(SHORTCUT_STORAGE_KEY);

    if (guardado === null) return DEFAULT_SHORTCUT;

    const existe = SHORTCUT_OPTIONS.some((option) => option.id === guardado);

    return existe ? guardado : DEFAULT_SHORTCUT;
  } catch {
    return DEFAULT_SHORTCUT;
  }
}

// Guarda la preferencia. Si el navegador no permite escribir, falla en
// silencio: el atajo sigue funcionando durante la sesión.
export function saveShortcut(id: string): void {
  try {
    localStorage.setItem(SHORTCUT_STORAGE_KEY, id);
  } catch {
    // La preferencia no se pudo guardar: se mantiene solo en memoria.
  }
}

// Compara la pulsación con el identificador configurado. La tecla de función
// no lleva modificadores; las combinaciones se distinguen por ellos.
export function matchesShortcut(event: KeyboardEvent, id: string): boolean {
  if (!id) return false;

  const sinMeta = !event.metaKey;

  if (id === "Enter") {
    return (
      event.key === "Enter" &&
      !event.ctrlKey &&
      !event.altKey &&
      !event.shiftKey &&
      sinMeta
    );
  }

  if (id === "Ctrl+Enter") {
    return (
      event.key === "Enter" &&
      event.ctrlKey &&
      !event.altKey &&
      !event.shiftKey &&
      sinMeta
    );
  }

  if (id === "Alt+Enter") {
    return (
      event.key === "Enter" &&
      event.altKey &&
      !event.ctrlKey &&
      !event.shiftKey &&
      sinMeta
    );
  }

  if (id === "Ctrl+Shift+Enter") {
    return (
      event.key === "Enter" &&
      event.ctrlKey &&
      event.shiftKey &&
      !event.altKey &&
      sinMeta
    );
  }

  // F2, F4, F8, F9: tecla de función sin modificadores.
  return (
    event.key === id &&
    !event.ctrlKey &&
    !event.altKey &&
    !event.shiftKey &&
    sinMeta
  );
}
