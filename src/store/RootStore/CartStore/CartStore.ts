import { ProductModel } from "@store/models";
import { CART_LOCALSTORAGE_KEY } from "@utils/localstorage";
import { action, computed, makeObservable, observable } from "mobx";

export interface CartItem {
  product: ProductModel;
  quantity: number;
}

type PrivateFields = "_cartItems";

export default class CartStore {
  private _cartItems: CartItem[] = [];

  constructor() {
    makeObservable<CartStore, PrivateFields>(this, {
      _cartItems: observable,
      cartItems: computed,
      addToCart: action,
      removeFromCart: action,
      resetCart: action,
      setCartItems: action,
    });
  }

  get cartItems(): CartItem[] {
    return this._cartItems;
  }

  setCartItems(value: CartItem[]) {
    this._cartItems = value;
  }

  addToCart(item: CartItem) {
    const isInCart = this._cartItems.find(
      (cartItem) => cartItem.product.id === item.product.id
    );
    if (isInCart) {
      this.cartItems.map((cartItem) => {
        if (cartItem.product.id === item.product.id) {
          return (cartItem.quantity += item.quantity);
        }
        return cartItem;
      });
      localStorage.setItem(
        CART_LOCALSTORAGE_KEY,
        JSON.stringify(this._cartItems)
      );
    } else {
      this._cartItems.push(item);
      localStorage.setItem(
        CART_LOCALSTORAGE_KEY,
        JSON.stringify(this._cartItems)
      );
    }
  }

  removeFromCart(id: number) {
    this._cartItems = this._cartItems.filter(
      (cartItem) => cartItem.product.id !== id
    );
    localStorage.setItem(
      CART_LOCALSTORAGE_KEY,
      JSON.stringify(this._cartItems)
    );
  }

  resetCart() {
    this._cartItems = [];
    localStorage.setItem(
      CART_LOCALSTORAGE_KEY,
      JSON.stringify(this._cartItems)
    );
  }
}
