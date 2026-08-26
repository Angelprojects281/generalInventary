import { Route, Routes, BrowserRouter } from "react-router-dom";
import "./styles/styles.css";
import InitPage from "./init/initPage";
import Login from "./general/login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InitPage />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
