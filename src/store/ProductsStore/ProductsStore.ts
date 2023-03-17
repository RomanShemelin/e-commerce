import { Option } from "@components/Dropdown/Dropdown";
import { API_ENDPOINTS } from "@configs/api";
import { ProductCategoryModel, ProductModel } from "@store/models";
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
  | "_totalProductsCount"
  | "_categoriesList"
  | "_filterValue"
  | "_categoryId"
  | "_searchCategory";

export default class ProductsStore implements ILocalStore {
  private _totalProductsList: ProductModel[] = [];
  private _totalProductsCount = 0;
  private _meta: Meta = Meta.initial;
  private _searchTitle: QuerySearch = "";
  private _productsPage = 0;
  private _hasMoreData = true;
  private _categoriesList: Option[] = [];
  private _filterValue: Option = { key: "", value: "" };
  private _categoryId = "";
  private _searchCategory: QuerySearch = "";

  constructor() {
    makeObservable<ProductsStore, PrivateFields>(this, {
      _totalProductsList: observable.ref,
      _totalProductsCount: observable,
      _meta: observable,
      _searchTitle: observable,
      _productsPage: observable,
      _hasMoreData: observable,
      _categoriesList: observable,
      _filterValue: observable,
      _categoryId: observable,
      _searchCategory: observable,
      totalProductsList: computed,
      totalProductsCount: computed,
      meta: computed,
      searchTitle: computed,
      hasMoreData: computed,
      productsPage: computed,
      categoriesList: computed,
      filterValue: computed,
      getProductsList: action,
      getTotalProductCount: action,
      clearProductList: action,
      setProductsPage: action,
      setHasMoreData: action,
      setSearchTitle: action,
      getCategoriesList: action,
      changeFilterOptions: action,
      setCategoryId: action,
      setSearchCategory: action,
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

  get categoriesList() {
    return this._categoriesList;
  }

  get filterValue() {
    return this._filterValue;
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

  setCategoryId(value: string) {
    this._categoryId = value;
  }

  async getProductsList(): Promise<void> {
    try {
      this._meta = Meta.loading;
      const result = await axios({
        method: "get",
        url: `${API_ENDPOINTS.PRODUCTS}?title=${this._searchTitle}&categoryId=${this._categoryId}&offset=${this._productsPage}&limit=10`,
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
        url: `${API_ENDPOINTS.PRODUCTS}?title=${this._searchTitle}&categoryId=${this._categoryId}`,
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

  async getCategoriesList(): Promise<void> {
    try {
      const result = await axios({
        method: "get",
        url: `${API_ENDPOINTS.CATEGORIES}`,
      });
      const categories = result.data.map((category: ProductCategoryModel) => ({
        key: category.id,
        value: category.name,
      }));
      runInAction(() => {
        this._categoriesList = [...categories];
        const filterValue = this._categoriesList.find(
          (category) => category.value === this._searchCategory
        );
        if (filterValue) {
          this._filterValue = filterValue;
          this._categoryId = filterValue.key;
        }
        this.getProductsList();
        this.getTotalProductCount();
      });
    } catch (error) {
      this._meta = Meta.error;
      this._categoriesList = [];
    }
  }

  changeFilterOptions(value: Option) {
    this._filterValue = value;
  }

  setSearchCategory(value: string) {
    this._searchCategory = value;
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
