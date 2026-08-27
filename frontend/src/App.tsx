import { Route, Routes, BrowserRouter } from "react-router-dom";
import "./styles/styles.css";
import InitPage from "./init/initPage";
import Login from "./general/login";
import MainAdmin from "./admin/mainAdmin";
import MainRegular from "./regular/regularMain";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InitPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/adminMain" element={<MainAdmin />} />
        <Route path="/regularMain" element={<MainRegular />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
