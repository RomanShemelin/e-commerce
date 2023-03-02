import { API_ENDPOINTS } from "@configs/api";
import { Product } from "@pages/ProductDetail";
import rootStore from "@store/RootStore/instance";
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

type searchTitle = undefined | string | string[] | qs.ParsedQs | qs.ParsedQs[];

type PrivateFields =
  | "_totalProductsList"
  | "_meta"
  | "_searchTitle"
  | "_productsPage"
  | "_hasMoreData";

export default class ProductsStore implements ILocalStore {
  private _totalProductsList: Product[] = [];
  private _meta: Meta = Meta.initial;
  private _searchTitle: searchTitle = "";
  private _productsPage: number = 0;
  private _hasMoreData: boolean = true;

  constructor() {
    makeObservable<ProductsStore, PrivateFields>(this, {
      _totalProductsList: observable.ref,
      _meta: observable,
      _searchTitle: observable,
      _productsPage: observable,
      _hasMoreData: observable,
      totalProductsList: computed,
      meta: computed,
      searchTitle: computed,
      hasMoreData: computed,
      productsPage: computed,
      getProductsList: action,
      clearProductList: action,
    });
  }

  get totalProductsList(): Product[] {
    return this._totalProductsList;
  }

  get meta(): Meta {
    return this._meta;
  }
  get searchTitle(): searchTitle {
    return this._searchTitle;
  }
  set searchTitle(value: searchTitle) {
    this._searchTitle = value;
  }

  get hasMoreData() {
    return this._hasMoreData;
  }

  set hasMoreData(status: boolean) {
    this._hasMoreData = status;
  }

  get productsPage() {
    return this._productsPage;
  }
  set productsPage(value: number) {
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
        if (result.data.length === 0 || result.data.length < 10) {
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

  clearProductList() {
    this._totalProductsList = [];
  }

  private readonly _qpReaction: IReactionDisposer = reaction(
    () => rootStore.query.getParam("search"),
    (search) => {
      this._searchTitle = search;
    }
  );

  destroy(): void {
    this._qpReaction();
  }
}
