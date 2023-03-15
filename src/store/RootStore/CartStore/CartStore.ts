import { ProductModel } from "@store/models";
import { action, computed, makeObservable, observable } from "mobx";

type PrivateFields = "_cartItems" | "_subtotal";

export default class CartStore {
  private _cartItems: ProductModel[] = [];
  private _subtotal = 0;

  constructor() {
    makeObservable<CartStore, PrivateFields>(this, {
      _cartItems: observable,
      _subtotal: observable,
      cartItems: computed,
      subtotal: computed,
      addToCart: action,
      removeFromCart: action,
      resetCart: action,
      getSubtotal: action,
      setCartItems: action,
    });
  }

  get cartItems(): ProductModel[] {
    return this._cartItems;
  }

  get subtotal() {
    return this._subtotal;
  }

  setCartItems(value: ProductModel[]) {
    this._cartItems = value;
    this.getSubtotal(this._cartItems);
  }

  addToCart(item: ProductModel) {
    const isInCart = this._cartItems.find(
      (cartItem) => cartItem.id === item.id
    );
    if (isInCart) {
      return;
    } else {
      this._cartItems.push(item);
      this.getSubtotal(this._cartItems);
      localStorage.setItem("cart", JSON.stringify(this._cartItems));
    }
  }

  removeFromCart(id: number) {
    this._cartItems = this._cartItems.filter((cartItem) => cartItem.id !== id);
    this.getSubtotal(this._cartItems);
    localStorage.setItem("cart", JSON.stringify(this._cartItems));
  }

  getSubtotal(items: ProductModel[]) {
    this._subtotal = this._cartItems.reduce(
      (total, priceItem) => total + priceItem.price,
      0
    );
  }

  resetCart() {
    this._cartItems = [];
    this._subtotal = 0;
    localStorage.setItem("cart", JSON.stringify(this._cartItems));
  }
}
