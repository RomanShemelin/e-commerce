export type ProductCategoryApi = {
  id: number;
  name: string;
  image: string;
};
export type ProductCategoryModel = {
  id: number;
  name: string;
  image: string;
};

export const normalizeProductCategory = (
  from: ProductCategoryApi
): ProductCategoryModel => ({
  id: from.id,
  name: from.name,
  image: from.image,
});
