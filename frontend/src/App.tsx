import { useEffect, useRef, useState } from "react";
import {
  Route,
  Routes,
  BrowserRouter,
  useLocation,
  useNavigate,
} from "react-router-dom";
import "./styles/styles.css";
import Welcome from "./welcome/welcome";
import ProtectRoute from "./ruteProtection/protectionRute";
import MainPanel from "./panel/mainPanel";
import ProductsScreen from "./panel/productsScreen";
import CategoriesScreen from "./panel/categoriesScreen";
import ProvidersScreen from "./panel/providersScreen";
import MovementsScreen from "./panel/movementsScreen";
import AccountScreen from "./panel/accountScreen";
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
      // hacia la bienvenida. Las rutas internas (panel, productos, etc.)
      // navegan sin preguntar, ya que no cierran la sesión.
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
      <div className="appToggles">
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
      </div>
      <BackNavigationGuard />
      <InactivityTimer />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route
          path="/panel"
          element={
            <ProtectRoute>
              <MainPanel />
            </ProtectRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectRoute>
              <ProductsScreen />
            </ProtectRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <ProtectRoute>
              <CategoriesScreen />
            </ProtectRoute>
          }
        />
        <Route
          path="/providers"
          element={
            <ProtectRoute>
              <ProvidersScreen />
            </ProtectRoute>
          }
        />
        <Route
          path="/movements"
          element={
            <ProtectRoute>
              <MovementsScreen />
            </ProtectRoute>
          }
        />
        <Route
          path="/account"
          element={
            <ProtectRoute>
              <AccountScreen />
            </ProtectRoute>
          }
        />
        <Route path="*" element={<Welcome />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
