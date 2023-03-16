import React, { useCallback, useEffect, useState } from "react";

import { Button } from "@components/Button";
import { Card } from "@components/Card";
import { ProductModel } from "@store/models";
import ProductDetailStore from "@store/ProductDetailStore";
import rootStore from "@store/RootStore/instance";
import { observer, useLocalStore } from "mobx-react-lite";
import { useNavigate, useParams } from "react-router-dom";

import cls from "./ProductDetail.module.scss";

const ProductDetail = observer(() => {
  const navigate = useNavigate();
  const { id } = useParams();
  const productDetailStore = useLocalStore(() => new ProductDetailStore());
  rootStore.query.setSearch(`productId=${id}`);
  const productId = rootStore.query.getParam("productId");
  const [quantity] = useState(1);

  useEffect(() => {
    productDetailStore.getProductDetail(productId);
  }, [productDetailStore, productId]);

  const addToCart = () => {
    if (productDetailStore.productDetail) {
      rootStore.cart.addToCart({
        product: productDetailStore.productDetail,
        quantity: quantity,
      });
    }
  };

  return (
    <div className={cls.ProductDetail}>
      <div className={cls.content}>
        <img
          className={cls.image}
          src={productDetailStore.productDetail?.images[0]}
          alt={productDetailStore.productDetail?.title}
        />
        <div className={cls.detail}>
          <h1 className={cls.title}>
            {productDetailStore.productDetail?.title}
          </h1>
          <p className={cls.description}>
            {productDetailStore.productDetail?.description}
          </p>
          <p className={cls.price}>
            ${productDetailStore.productDetail?.price}
          </p>
          <Button className={cls.buy}>Buy Now</Button>
          <Button className={cls.add} onClick={addToCart}>
            Add to Card
          </Button>
        </div>
      </div>
      <h2 className={cls.related_title}>Related Items</h2>
      <div className={cls.related_list}>
        {productDetailStore.relatedProductsList.map((product: ProductModel) => (
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
    </div>
  );
});
export default React.memo(ProductDetail);
