import { Navbar } from "@components/Navbar";
import { ROUTES } from "@configs/routes";
import { ProductDetail } from "@pages/ProductDetail";
import Products from "@pages/Products";
import { useQueryParamsStoreInit } from "@store/RootStore/hooks/useQueryParamsStoreInit";
import { Navigate, Route, Routes } from "react-router-dom";

import "./App.scss";

function App() {
  useQueryParamsStoreInit();
  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path={ROUTES.MAIN} element={<Products />} />
        <Route path={ROUTES.PRODUCT} element={<ProductDetail />} />
        <Route path="*" element={<Navigate to={ROUTES.MAIN} replace />} />
      </Routes>
    </div>
  );
}

export default App;
