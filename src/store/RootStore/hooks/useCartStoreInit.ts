import rootStore from "../instance";

export const useCartStoreInit = (): void => {
  const cartItems = JSON.parse(localStorage.getItem("cart") || "");
  rootStore.cart.setCartItems(cartItems);
};
