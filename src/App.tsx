import { ProductDetail } from "@pages/ProductDetail";
import Products from "@pages/Products";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import "./App.scss";

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/product">
            <Route path=":id" element={<ProductDetail />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
