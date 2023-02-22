import { useEffect, useState } from "react";

import { Product } from "@pages/ProductDetail";
import FilterIcon from "@shared/assets/filter.svg";
import SearchIcon from "@shared/assets/search-normal.svg";
import { Button } from "@shared/ui/Button";
import { Card } from "@shared/ui/Card";
import { Input } from "@shared/ui/Input";
import { Loader, LoaderSize } from "@shared/ui/Loader";
import Navbar from "@widgets/Navbar";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate } from "react-router-dom";

import cls from "./Products.module.scss";

export default function Products() {
  const [inputValue, setInputValue] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(0);
  const [totalProducts, setTotalProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const countProducts = async () => {
      const result = await axios({
        method: "get",
        url: "https://api.escuelajs.co/api/v1/products",
      });
      setTotalProducts(result.data);
    };
    countProducts();
  }, []);

  useEffect(() => {
    const fetch = async () => {
      const result = await axios({
        method: "get",
        url: `https://api.escuelajs.co/api/v1/products?offset=${page}&limit=10`,
      });
      setProducts((products) => [...products, ...result.data]);
    };
    fetch();
  }, [page]);

  return (
    <div className={cls.Products}>
      <Navbar />
      <div className={cls.container}>
        <h1>Products</h1>
        <p className={cls.subtitle}>
          We display products based on the latest products we have, if you want
          to see our old products please enter the name of the item
        </p>
        <div className={cls.search_container}>
          <div className={cls.search}>
            <img src={SearchIcon} alt="search" />
            <Input
              value={inputValue}
              onChange={setInputValue}
              placeholder="Search property"
            />
            <Button className={cls.find_button}>Find Now</Button>
          </div>
          <Button className={cls.filter_button}>
            <img src={FilterIcon} alt="filter" />
            Filter
          </Button>
        </div>
        <div className={cls.products_info}>
          <h2>Total Product</h2>
          <div className={cls._count}>{totalProducts.length}</div>
        </div>
      </div>
      <InfiniteScroll
        dataLength={products.length}
        next={() => setPage(page + 10)}
        hasMore={products.length < 200}
        loader={<Loader size={LoaderSize.l} />}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>You have seen it all</b>
          </p>
        }
      >
        <div className={cls.products_list}>
          {products.map((product: Product) => (
            <Card
              key={product.id}
              id={product.id}
              image={product.images[0]}
              category={product.category.name}
              title={product.title}
              content={product.price}
              onClick={() => navigate(`/product/${product.id}`)}
            />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}
