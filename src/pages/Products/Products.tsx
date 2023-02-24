import React, { useEffect, useState } from "react";

import { Button } from "@components/Button";
import { Card } from "@components/Card";
import { Input } from "@components/Input";
import { Loader, LoaderSize } from "@components/Loader";
import { API_ENDPOINTS } from "@configs/api";
import FilterIcon from "@icons/filter.svg";
import SearchIcon from "@icons/search-normal.svg";
import { Product } from "@pages/ProductDetail";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate } from "react-router-dom";

import cls from "./Products.module.scss";

const Products = () => {
  const [inputValue, setInputValue] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(0);
  const [totalProducts, setTotalProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const countProducts = async () => {
      try {
        const result = await axios({
          method: "get",
          url: API_ENDPOINTS.PRODUCTS,
        });
        setTotalProducts(result.data);
      } catch (error) {
        throw new Error("error");
      }
    };
    countProducts();
  }, []);

  useEffect(() => {
    const fetch = async () => {
      try {
        const result = await axios({
          method: "get",
          url: `${API_ENDPOINTS.PRODUCTS}?offset=${page}&limit=10`,
        });
        setProducts((products) => [...products, ...result.data]);
      } catch (error) {
        throw new Error("error");
      }
    };
    fetch();
  }, [page]);

  return (
    <div className={cls.Products}>
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
            <Button>Find Now</Button>
          </div>
          <Button className={cls.filter_button}>
            <img src={FilterIcon} alt="filter" />
            Filter
          </Button>
        </div>
        <div className={cls.products_info}>
          <h2>Total Product</h2>
          <div className={cls.count}>{totalProducts.length}</div>
        </div>
      </div>
      <InfiniteScroll
        className={cls.infinite_scroll}
        dataLength={products.length}
        next={() => setPage((prevPage) => prevPage + 10)}
        hasMore={
          products.length === 0 || totalProducts.length !== products.length
        }
        loader={<Loader size={LoaderSize.l} />}
        endMessage={<h2>You have seen it all</h2>}
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
};
export default React.memo(Products);
