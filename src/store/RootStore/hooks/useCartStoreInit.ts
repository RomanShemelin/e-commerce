import rootStore from "../instance";

export const useCartStoreInit = (): void => {
  const cartField = localStorage.getItem("cart");
  const cartItems = cartField ? JSON.parse(cartField) : [];
  rootStore.cart.setCartItems(cartItems);
};
