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
import FaqScreen from "./panel/faqScreen";
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

type Theme =
  | "claro"
  | "oscuro"
  | "verde"
  | "verde-oscuro"
  | "morado"
  | "morado-oscuro"
  | "naranja"
  | "naranja-oscuro"
  | "rosa"
  | "rosa-oscuro";

const THEMES: { id: Theme; swatch: string; labelKey: string }[] = [
  { id: "claro", swatch: "#f3f5f9", labelKey: "claro" },
  { id: "oscuro", swatch: "#12161d", labelKey: "oscuro" },
  { id: "verde", swatch: "#2f8f5b", labelKey: "verde" },
  { id: "verde-oscuro", swatch: "#5fd39a", labelKey: "verde oscuro" },
  { id: "morado", swatch: "#7c4dcc", labelKey: "morado" },
  { id: "morado-oscuro", swatch: "#a982f0", labelKey: "morado oscuro" },
  { id: "naranja", swatch: "#d4712f", labelKey: "naranja" },
  { id: "naranja-oscuro", swatch: "#f5a05f", labelKey: "naranja oscuro" },
  { id: "rosa", swatch: "#d44f86", labelKey: "rosa" },
  { id: "rosa-oscuro", swatch: "#ff8fb5", labelKey: "rosa oscuro" },
];

const THEME_IDS: readonly string[] = THEMES.map(({ id }) => id);

// Acepta también los valores antiguos ("light"/"dark") por si el script del
// index.html no llegó a migrarlos; cualquier otro valor cae en el default.
function normalizeTheme(value?: string): Theme {
  if (value === "light") return "claro";
  if (value === "dark") return "oscuro";
  return THEME_IDS.includes(value ?? "") ? (value as Theme) : "claro";
}

// El atributo data-theme se fija desde una función fuera del componente:
// react-hooks/immutability no permite asignar a document en los closures
// creados durante el render (p. ej. el onClick de cada swatch del menú).
function applyThemeAttribute(id: Theme) {
  document.documentElement.dataset.theme = id;
}

function App() {
  const { language, toggleLanguage, t } = useTranslation();
  const [theme, setTheme] = useState<Theme>(() =>
    normalizeTheme(document.documentElement.dataset.theme),
  );
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const themePickerRef = useRef<HTMLDivElement>(null);

  const selectTheme = (id: Theme) => {
    applyThemeAttribute(id);
    setTheme(id);
    setThemeMenuOpen(false);

    try {
      localStorage.setItem("inventario-theme", id);
    } catch {
      // The current theme still applies until the page is reloaded.
    }
  };

  // El popover se cierra al pulsar fuera del selector de temas.
  useEffect(() => {
    if (!themeMenuOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (
        themePickerRef.current &&
        event.target instanceof Node &&
        !themePickerRef.current.contains(event.target)
      ) {
        setThemeMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [themeMenuOpen]);

  const darkTheme = theme === "oscuro" || theme.endsWith("-oscuro");

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
        <div className="themePicker" ref={themePickerRef}>
          <button
            className="themeToggle"
            type="button"
            aria-label={t("Elegir tema")}
            aria-expanded={themeMenuOpen}
            aria-controls="themeMenu"
            title={t("Elegir tema")}
            onClick={() => setThemeMenuOpen((open) => !open)}
          >
            <span aria-hidden="true">{darkTheme ? "☾" : "☀"}</span>
          </button>
          {themeMenuOpen && (
            <div
              className="themeMenu"
              id="themeMenu"
              role="group"
              aria-label={t("Tema")}
            >
              {THEMES.map((option) => (
                <button
                  key={option.id}
                  className="themeSwatch"
                  type="button"
                  style={{ backgroundColor: option.swatch }}
                  aria-label={t(option.labelKey)}
                  aria-pressed={option.id === theme}
                  title={t(option.labelKey)}
                  onClick={() => selectTheme(option.id)}
                />
              ))}
            </div>
          )}
        </div>
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
          path="/faq"
          element={
            <ProtectRoute>
              <FaqScreen />
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
