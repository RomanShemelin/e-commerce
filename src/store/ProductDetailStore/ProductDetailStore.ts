import { API_ENDPOINTS } from "@configs/api";
import { ProductModel } from "@store/models";
import { QuerySearch } from "@store/RootStore/QueryParamsStore";
import { Meta } from "@utils/meta";
import { ILocalStore } from "@utils/useLocalStore";
import axios from "axios";
import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";

type PrivateFields = "_productDetail" | "_relatedProductsList" | "_meta";

export default class ProductDetailStore implements ILocalStore {
  private _productDetail: ProductModel | null = null;
  private _relatedProductsList: ProductModel[] = [];
  private _meta: Meta = Meta.initial;

  constructor() {
    makeObservable<ProductDetailStore, PrivateFields>(this, {
      _relatedProductsList: observable,
      _productDetail: observable,
      _meta: observable,
      productDetail: computed,
      relatedProductsList: computed,
      meta: computed,
      getProductDetail: action,
      getRelatedProductsList: action,
    });
  }

  get productDetail() {
    return this._productDetail;
  }

  get relatedProductsList() {
    return this._relatedProductsList;
  }

  get meta() {
    return this._meta;
  }

  async getProductDetail(id: QuerySearch): Promise<void> {
    try {
      const result = await axios({
        method: "get",
        url: `${API_ENDPOINTS.PRODUCTS}/${id}`,
      });
      runInAction(() => {
        if (result.data) {
          this._productDetail = result.data;
          this.getRelatedProductsList(this._productDetail?.category.id);
        }
      });
    } catch (error) {
      this._meta = Meta.error;
    }
  }

  async getRelatedProductsList(categoryId: number | undefined): Promise<void> {
    try {
      this._relatedProductsList = [];
      const result = await axios({
        method: "get",
        url: `${API_ENDPOINTS.PRODUCTS}?categoryId=${categoryId}`,
      });
      runInAction(() => {
        if (result.data) {
          const filteredData = result.data
            .filter(
              (product: ProductModel) => product.id !== this._productDetail?.id
            )
            .slice(0, 3);
          this._relatedProductsList = [...filteredData];
        }
      });
    } catch (error) {
      this._meta = Meta.error;
      this._relatedProductsList = [];
    }
  }

  destroy(): void {}
}
