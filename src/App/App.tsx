import Navbar from "@components/Navbar";
import { ROUTES } from "@configs/routes";
import { ProductDetail } from "@pages/ProductDetail";
import Products from "@pages/Products";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import "./App.scss";

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path={ROUTES.MAIN} element={<Products />} />
          <Route path={ROUTES.PRODUCT} element={<ProductDetail />} />
          <Route path="*" element={<Navigate to={ROUTES.MAIN} replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
