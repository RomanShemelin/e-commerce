import { useEffect, useState } from "react";

import { Button } from "@shared/ui/Button";
import { Card } from "@shared/ui/Card";
import Navbar from "@widgets/Navbar";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import cls from "./ProductDetail.module.scss";

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  images: string[];
  category: {
    id: number;
    name: string;
    image: string;
  };
}

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product>();
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const result = await axios({
        method: "get",
        url: `https://api.escuelajs.co/api/v1/products/${id}`,
      });
      setProduct(result.data);
    };
    fetch();
  }, [id]);

  useEffect(() => {
    const getRelatedProducts = async () => {
      if (product) {
        const result = await axios({
          method: "get",
          url: `https://api.escuelajs.co/api/v1/products/?categoryId=${product.category.id}`,
        });
        const filteredData = result.data
          .filter((product: Product) => product.id !== Number(id))
          .slice(0, 3);
        setRelatedProducts(filteredData);
      }
    };
    getRelatedProducts();
  }, [product, id]);

  return (
    <div className={cls.ProductDetail}>
      <Navbar />
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
}
