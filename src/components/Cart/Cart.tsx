import { memo, useCallback } from "react";

import { Button } from "@components/Button";
import TrashIcon from "@icons/trash.svg";
import { CartItem } from "@store/RootStore/CartStore/CartStore";
import rootStore from "@store/RootStore/instance";
import { observer } from "mobx-react-lite";

import cls from "./Cart.module.scss";

const Cart = observer(() => {
  const deleteItem = (id: number) => () => {
    rootStore.cart.removeFromCart(id);
  };

  const resetCart = useCallback(() => {
    rootStore.cart.resetCart();
  }, []);

  const subtotalPrice = useCallback(() => {
    let total = 0;
    rootStore.cart.cartItems.forEach(
      (item: CartItem) => (total += item.quantity * item.product.price)
    );
    return total.toFixed(2);
  }, []);

  return (
    <div className={cls.Cart}>
      <h2>Products in your cart</h2>
      {rootStore.cart.cartItems.length === 0 && (
        <div className="cart__empty">
          <p>Your cart is empty.</p>
        </div>
      )}
      {rootStore.cart.cartItems?.map((item: CartItem) => (
        <div className={cls.product} key={item.product.id}>
          <img
            className={cls.product_image}
            src={item.product.images[0]}
            alt={item.product.title}
          />
          <div className={cls.detail}>
            <h2 className={cls.title}>{item.product.title}</h2>
            <p>{item.product.description.substring(0, 20)}</p>
            <div className={cls.price}>
              {item.quantity} x ${item.product.price}
            </div>
          </div>
          <img
            className={cls.trash}
            src={TrashIcon}
            alt="trash"
            onClick={deleteItem(item.product.id)}
          />
        </div>
      ))}
      <div className={cls.total}>
        <span>SUBTOTAL</span>
        <span>${subtotalPrice()}</span>
      </div>
      <Button className={cls.checkout_btn}>PROCEED TO CHECKOUT</Button>
      <span className={cls.reset} onClick={resetCart}>
        Reset Cart
      </span>
    </div>
  );
});

export default memo(Cart);
