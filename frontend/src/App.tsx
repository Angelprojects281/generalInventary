import { useEffect, useRef } from "react";
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

function App() {
  return (
    <BrowserRouter>
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
