import React, { useEffect, useState } from "react";

import { Button } from "@components/Button";
import { Card } from "@components/Card";
import { API_ENDPOINTS } from "@configs/api";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import cls from "./ProductDetail.module.scss";

export interface ProductCategory {
  id: number;
  name: string;
  image: string;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  images: string[];
  category: ProductCategory;
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product>();
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const result = await axios({
          method: "get",
          url: `${API_ENDPOINTS.PRODUCTS}/${id}`,
        });
        setProduct(result.data);
      } catch (error) {
        throw new Error("error");
      }
    };
    fetch();
  }, [id]);

  useEffect(() => {
    const getRelatedProducts = async () => {
      try {
        if (!product) return;
        const result = await axios({
          method: "get",
          url: `${API_ENDPOINTS.PRODUCTS}/?categoryId=${product.category.id}`,
        });
        const filteredData = result.data
          .filter((product: Product) => product.id !== Number(id))
          .slice(0, 3);
        setRelatedProducts(filteredData);
      } catch (error) {
        throw new Error("error");
      }
    };
    getRelatedProducts();
  }, [product, id]);

  return (
    <div className={cls.ProductDetail}>
      {product && (
        <div className={cls.content}>
          <img
            className={cls.image}
            src={product.images[0]}
            alt={product.title}
          />
          <div className={cls.detail}>
            <h1 className={cls.title}>{product.title}</h1>
            <p className={cls.description}>{product.description}</p>
            <p className={cls.price}>${product.price}</p>
            <Button className={cls.buy}>Buy Now</Button>
            <Button className={cls.add}>Add to Card</Button>
          </div>
        </div>
      )}
      <h2 className={cls.related_title}>Related Items</h2>
      <div className={cls.related_list}>
        {relatedProducts.map((product: Product) => (
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
};
export default React.memo(ProductDetail);
