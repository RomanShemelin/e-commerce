import React, { useCallback, useEffect } from "react";

import { Button } from "@components/Button";
import { Card } from "@components/Card";
import { Dropdown, Option } from "@components/Dropdown/Dropdown";
import { Input } from "@components/Input";
import { Loader, LoaderSize } from "@components/Loader";
import SearchIcon from "@icons/search-normal.svg";
import { ProductModel } from "@store/models";
import ProductsStore from "@store/ProductsStore";
import rootStore from "@store/RootStore/instance";
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
    productsStore.setSearchTitle(searchParams.get("search") || "");
    productsStore.setSearchCategory(searchParams.get("category") || "");
    productsStore.getCategoriesList();
  }, []);

  const searchHandler = useCallback(
    (title: string) => {
      setSearchParams((searchParams) => {
        title
          ? searchParams.set("search", title)
          : searchParams.delete("search");
        return searchParams;
      });
      productsStore.setHasMoreData(true);
    },
    [productsStore, setSearchParams]
  );

  const handleGetProductsList = useCallback(() => {
    productsStore.clearProductList();
    productsStore.setProductsPage(0);
    productsStore.getProductsList();
    productsStore.getTotalProductCount();
  }, [productsStore]);

  const getNextProductPage = useCallback(
    () => productsStore.getProductsList(),
    [productsStore]
  );

  const handleChangeFilter = (option: Option) => {
    productsStore.changeFilterOptions(option);
    productsStore.setCategoryId(option.key || "");
    productsStore.clearProductList();
    productsStore.setProductsPage(0);
    productsStore.getProductsList();
    productsStore.getTotalProductCount();
    setSearchParams((searchParams) => {
      option.value
        ? searchParams.set("category", option.value)
        : searchParams.delete("category");
      return searchParams;
    });
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
              onClick={handleGetProductsList}
              loading={productsStore.meta === "loading"}
              disabled={!productsStore.hasMoreData}
            >
              Find Now
            </Button>
          </div>
          <Dropdown
            options={productsStore.categoriesList}
            value={productsStore.filterValue}
            onChange={handleChangeFilter}
          />
        </div>
        <div className={cls.products_info}>
          <h2>Total Product</h2>
          <div className={cls.count}>{productsStore.totalProductsCount}</div>
        </div>
      </div>
      <InfiniteScroll
        className={cls.infinite_scroll}
        dataLength={productsStore.totalProductsList.length}
        next={getNextProductPage}
        hasMore={productsStore.hasMoreData}
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
          {productsStore.totalProductsList.map((product: ProductModel) => (
            <Card
              key={product.id}
              id={product.id}
              image={product.images[0]}
              category={product.category.name}
              title={product.title}
              content={product.price}
              onClick={() => {
                rootStore.query.setSearch(`productId=${product.id}`);
                navigate(`/product/${product.id}`);
              }}
            />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
});
export default React.memo(Products);
