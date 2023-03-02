import React, { useEffect } from "react";

import { Button } from "@components/Button";
import { Card } from "@components/Card";
import { Input } from "@components/Input";
import { Loader, LoaderSize } from "@components/Loader";
import FilterIcon from "@icons/filter.svg";
import SearchIcon from "@icons/search-normal.svg";
import { Product } from "@pages/ProductDetail";
import ProductsStore from "@store/ProductsStore";
import { useLocalStore } from "@utils/useLocalStore";
import { observer } from "mobx-react-lite";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate, useSearchParams } from "react-router-dom";

import cls from "./Products.module.scss";

const Products = observer(() => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const productsStore = useLocalStore(() => new ProductsStore());

  useEffect(() => {
    productsStore.searchTitle = searchParams.get("search") || "";
    productsStore.getProductsList();
  }, []);

  const searchHandler = (title: string) => {
    let search;
    if (title) {
      search = {
        search: title,
      };
    } else {
      search = {
        search: "",
      };
    }
    setSearchParams(search);
    productsStore.hasMoreData = true;
  };

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
              value={searchParams.get("search") || ""}
              onChange={searchHandler}
              placeholder="Search property"
            />
            <Button
              onClick={() => {
                productsStore.clearProductList();
                productsStore.productsPage = 0;
                productsStore.getProductsList();
              }}
              loading={productsStore.meta === "loading"}
              disabled={!productsStore.hasMoreData}
            >
              Find Now
            </Button>
          </div>
          <Button className={cls.filter_button}>
            <img src={FilterIcon} alt="filter" />
            Filter
          </Button>
        </div>
        <div className={cls.products_info}>
          <h2>Total Product</h2>
          <div className={cls.count}>
            {productsStore.totalProductsList.length}
          </div>
        </div>
      </div>
      <InfiniteScroll
        className={cls.infinite_scroll}
        dataLength={productsStore.totalProductsList.length}
        next={() => productsStore.getProductsList()}
        hasMore={
          productsStore.totalProductsList.length !== 0 &&
          productsStore.hasMoreData
        }
        loader={<Loader size={LoaderSize.l} />}
        endMessage={
          productsStore.meta === "error" ? (
            <h2>Network error, please try again later</h2>
          ) : (
            <h2>You have seen it all</h2>
          )
        }
      >
        <div className={cls.products_list}>
          {productsStore.totalProductsList.map((product: Product) => (
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
});
export default React.memo(Products);
