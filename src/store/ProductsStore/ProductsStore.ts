import { API_ENDPOINTS } from "@configs/api";
import { ProductModel } from "@store/models";
import rootStore from "@store/RootStore/instance";
import { QuerySearch } from "@store/RootStore/QueryParamsStore";
import { Meta } from "@utils/meta";
import { ILocalStore } from "@utils/useLocalStore";
import axios from "axios";
import {
  action,
  computed,
  IReactionDisposer,
  makeObservable,
  observable,
  reaction,
  runInAction,
} from "mobx";

type PrivateFields =
  | "_totalProductsList"
  | "_meta"
  | "_searchTitle"
  | "_productsPage"
  | "_hasMoreData"
  | "_totalProductsCount";

export default class ProductsStore implements ILocalStore {
  private _totalProductsList: ProductModel[] = [];
  private _totalProductsCount = 0;
  private _meta: Meta = Meta.initial;
  private _searchTitle: QuerySearch = "";
  private _productsPage = 0;
  private _hasMoreData = true;

  constructor() {
    makeObservable<ProductsStore, PrivateFields>(this, {
      _totalProductsList: observable.ref,
      _totalProductsCount: observable,
      _meta: observable,
      _searchTitle: observable,
      _productsPage: observable,
      _hasMoreData: observable,
      totalProductsList: computed,
      totalProductsCount: computed,
      meta: computed,
      searchTitle: computed,
      hasMoreData: computed,
      productsPage: computed,
      getProductsList: action,
      getTotalProductCount: action,
      clearProductList: action,
      setProductsPage: action,
      setHasMoreData: action,
      setSearchTitle: action,
    });
  }

  get totalProductsList(): ProductModel[] {
    return this._totalProductsList;
  }

  get totalProductsCount() {
    return this._totalProductsCount;
  }

  get meta(): Meta {
    return this._meta;
  }

  get searchTitle(): QuerySearch {
    return this._searchTitle;
  }

  get hasMoreData() {
    return this._hasMoreData;
  }

  get productsPage() {
    return this._productsPage;
  }

  setSearchTitle(value: QuerySearch) {
    this._searchTitle = value;
  }

  setHasMoreData(status: boolean) {
    this._hasMoreData = status;
  }

  setProductsPage(value: number) {
    this._productsPage = value;
  }

  async getProductsList(): Promise<void> {
    try {
      this._meta = Meta.loading;
      const result = await axios({
        method: "get",
        url: `${API_ENDPOINTS.PRODUCTS}?title=${this._searchTitle}&offset=${this._productsPage}&limit=10`,
      });
      runInAction(() => {
        this._meta = Meta.success;
        this._totalProductsList = [...this._totalProductsList, ...result.data];
        if (result.data.length < 10) {
          this._hasMoreData = false;
        }
        this._productsPage = this._productsPage + 10;
        return;
      });
    } catch (error) {
      this._meta = Meta.error;
      this._totalProductsList = [];
      this._hasMoreData = false;
    }
  }

  async getTotalProductCount(): Promise<void> {
    try {
      const result = await axios({
        method: "get",
        url: `${API_ENDPOINTS.PRODUCTS}?title=${this._searchTitle}`,
      });
      runInAction(() => {
        this._totalProductsCount = result.data.length;
      });
    } catch (error) {
      this._meta = Meta.error;
      this._totalProductsCount = 0;
    }
  }

  clearProductList() {
    this._totalProductsList = [];
  }

  private readonly _qpReaction: IReactionDisposer = reaction(
    () => rootStore.query.getParam("search") || "",
    (search) => {
      this._searchTitle = search;
    }
  );

  destroy(): void {
    this._qpReaction();
  }
}
