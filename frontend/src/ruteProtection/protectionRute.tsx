import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { mostrarAlerta } from "../alerts/alert";

interface props {
  children: ReactNode;
}

export default function ProtectRoute({ children }: props) {
  if (!localStorage.getItem("token")) {
    mostrarAlerta("error", "Sesión no encontrada.", "Inicie sesión.");
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
