import {
  normalizeProductCategory,
  ProductCategoryApi,
  ProductCategoryModel,
} from "../Category/Category";

export type ProductApi = {
  id: number;
  title: string;
  price: number;
  description: string;
  images: string[];
  category: ProductCategoryApi;
};

export type ProductModel = {
  id: number;
  title: string;
  price: number;
  description: string;
  images: string[];
  category: ProductCategoryModel;
};

export const normalizeProductModel = (from: ProductApi): ProductModel => ({
  id: from.id,
  title: from.title,
  price: from.price,
  description: from.description,
  images: from.images,
  category: normalizeProductCategory(from.category),
});
