import { Navbar } from "@components/Navbar";
import { ROUTES } from "@configs/routes";
import { ProductDetail } from "@pages/ProductDetail";
import Products from "@pages/Products";
import { useCartStoreInit } from "@store/RootStore/hooks/useCartStoreInit";
import { useQueryParamsStoreInit } from "@store/RootStore/hooks/useQueryParamsStoreInit";
import { Navigate, Route, Routes } from "react-router-dom";

import "./App.scss";

const App = () => {
  useQueryParamsStoreInit();
  useCartStoreInit();
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
};

export default App;
