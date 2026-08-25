import { Route, Routes, BrowserRouter } from "react-router-dom";

import InitPage from "./init/initPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InitPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
