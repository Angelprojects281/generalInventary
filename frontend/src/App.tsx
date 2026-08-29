import { Route, Routes, BrowserRouter } from "react-router-dom";
import "./styles/styles.css";
import InitPage from "./init/initPage";
import Login from "./general/login";
import MainAdmin from "./admin/mainAdmin";
import MainRegular from "./regular/regularMain";
import AdminUsers from "./admin/adminUsers";
import ProtectRoute from "./ruteProtection/protectionRute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InitPage />} />
        <Route path="/login" element={<Login />} />
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
