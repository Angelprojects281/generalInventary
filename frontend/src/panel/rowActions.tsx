import type { LucideIcon } from "lucide-react";
import { useTranslation } from "../i18n";

export interface RowAction {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  danger?: boolean;
}

interface RowActionsProps {
  actions: RowAction[];
}

// Acciones de una fila como botones-icono, sin texto, para que la
// columna ocupe poco y quepa crecer en el futuro.
function RowActions({ actions }: RowActionsProps) {
  const { t } = useTranslation();

  return (
    <div className="rowActionsCell">
      {actions.map((action) => (
        <button
          key={action.label}
          type="button"
          className={`rowActionButton${action.danger ? " dangerButton" : ""}`}
          aria-label={t(action.label)}
          title={t(action.label)}
          onClick={action.onClick}
        >
          <action.icon size={18} aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}

export default RowActions;
