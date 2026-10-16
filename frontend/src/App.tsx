import { useEffect, useRef, useState } from "react";
import {
  Route,
  Routes,
  BrowserRouter,
  useLocation,
  useNavigate,
} from "react-router-dom";
import "./styles/styles.css";
import Login from "./general/login";
import MainAdmin from "./admin/mainAdmin";
import MainRegular from "./regular/regularMain";
import AdminUsers from "./admin/users/adminUsers";
import ProtectRoute from "./ruteProtection/protectionRute";
import AdminCategory from "./admin/categories/adminCategory";
import AdminProviders from "./admin/providers/adminProviders";
import AdminMovements from "./admin/movements/movements";
import ProductsReg from "./regular/products/productsReg";
import InactivityTimer from "./session/inactivityTimer";
import { confirmarCierreSesion } from "./session/session";
import { useTranslation } from "./i18n";

function BackNavigationGuard() {
  const location = useLocation();
  const navigate = useNavigate();
  const historyIndex = useRef<number | null>(null);
  const closingDialogOpen = useRef(false);
  const navigateRef = useRef(navigate);

  useEffect(() => {
    navigateRef.current = navigate;
  }, [navigate]);

  useEffect(() => {
    const currentIndex = window.history.state?.idx;
    historyIndex.current =
      typeof currentIndex === "number" ? currentIndex : null;

    const handlePopState = () => {
      const nextIndex = window.history.state?.idx;
      const wentBack =
        typeof nextIndex === "number" &&
        historyIndex.current !== null &&
        nextIndex < historyIndex.current;

      historyIndex.current =
        typeof nextIndex === "number" ? nextIndex : historyIndex.current;

      if (!wentBack) {
        return;
      }

      if (!localStorage.getItem("token")) {
        navigateRef.current("/", { replace: true });
        return;
      }

      // La confirmación solo aplica cuando la vuelta atrás sale de la app
      // hacia el login. Las rutas internas (panel, productos, etc.) navegan
      // sin preguntar, ya que no cierran la sesión.
      if (window.location.pathname !== "/") {
        return;
      }

      if (closingDialogOpen.current) {
        return;
      }

      closingDialogOpen.current = true;
      confirmarCierreSesion(navigateRef.current).then((sessionClosed) => {
        closingDialogOpen.current = false;

        if (!sessionClosed) {
          window.history.forward();
        }
      });
    };

    // El listener se adjunta una sola vez: si se readjunta en cada render, el
    // router remueve el listener durante el despacho del propio popstate y el
    // navegador lo omite antes de invocarlo.
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        window.location.reload();
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  useEffect(() => {
    const currentIndex = window.history.state?.idx;
    // Solo se actualiza si el índice avanza (push o "adelante"). Si el router
    // procesa un popstate antes que el handler, sobrescribir hacia atrás haría
    // que wentBack fuera siempre false y la confirmación nunca apareciera.
    if (
      typeof currentIndex === "number" &&
      (historyIndex.current === null || currentIndex > historyIndex.current)
    ) {
      historyIndex.current = currentIndex;
    }
  }, [location.pathname]);

  return null;
}

type Theme = "light" | "dark";

function App() {
  const { language, toggleLanguage, t } = useTranslation();
  const [theme, setTheme] = useState<Theme>(
    document.documentElement.dataset.theme === "dark" ? "dark" : "light",
  );

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    setTheme(nextTheme);

    try {
      localStorage.setItem("inventario-theme", nextTheme);
    } catch {
      // The current theme still applies until the page is reloaded.
    }
  };

  return (
    <BrowserRouter>
      <button
        className="languageToggle"
        type="button"
        aria-label={t("Cambiar idioma")}
        title={t("Cambiar idioma")}
        onClick={toggleLanguage}
      >
        {language === "es" ? "EN" : "ES"}
      </button>
      <button
        className="themeToggle"
        type="button"
        aria-label={`${t("Cambiar a tema")} ${t(theme === "dark" ? "claro" : "oscuro")}`}
        aria-pressed={theme === "dark"}
        title={`${t("Cambiar a tema")} ${t(theme === "dark" ? "claro" : "oscuro")}`}
        onClick={toggleTheme}
      >
        <span aria-hidden="true">{theme === "dark" ? "☾" : "☀"}</span>
      </button>
      <BackNavigationGuard />
      <InactivityTimer />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/adminMain"
          element={<ProtectRoute page={<MainAdmin />} authorizedRol="admin" />}
        />
        <Route
          path="/regularMain"
          element={
            <ProtectRoute page={<MainRegular />} authorizedRol="regular" />
          }
        />
        <Route
          path="/adminUsers"
          element={<ProtectRoute page={<AdminUsers />} authorizedRol="admin" />}
        />

        <Route
          path="/adminCategory"
          element={
            <ProtectRoute page={<AdminCategory />} authorizedRol="admin" />
          }
        />

        <Route
          path="/adminProviders"
          element={
            <ProtectRoute page={<AdminProviders />} authorizedRol="admin" />
          }
        />

        <Route
          path="/adminMovements"
          element={
            <ProtectRoute page={<AdminMovements />} authorizedRol="admin" />
          }
        />

        <Route
          path="/productsReg"
          element={
            <ProtectRoute page={<ProductsReg />} authorizedRol="regular" />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
