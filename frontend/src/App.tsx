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

function BackNavigationGuard() {
  const location = useLocation();
  const navigate = useNavigate();
  const historyIndex = useRef<number | null>(null);

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

      if (wentBack) {
        localStorage.removeItem("token");
        navigate("/", { replace: true });
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [navigate]);

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
    if (typeof currentIndex === "number") {
      historyIndex.current = currentIndex;
    }
  }, [location.pathname]);

  return null;
}

type Theme = "light" | "dark";

function App() {
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
        className="themeToggle"
        type="button"
        aria-label={`Cambiar a tema ${theme === "dark" ? "claro" : "oscuro"}`}
        aria-pressed={theme === "dark"}
        title={`Cambiar a tema ${theme === "dark" ? "claro" : "oscuro"}`}
        onClick={toggleTheme}
      >
        <span aria-hidden="true">{theme === "dark" ? "☾" : "☀"}</span>
      </button>
      <BackNavigationGuard />
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
