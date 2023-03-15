import { memo } from "react";

import { Button } from "@components/Button";
import TrashIcon from "@icons/trash.svg";
import { ProductModel } from "@store/models";
import rootStore from "@store/RootStore/instance";
import { observer } from "mobx-react-lite";

import cls from "./Cart.module.scss";

const Cart = observer(() => {

  const deleteItem = (id: number) => {
    rootStore.cart.removeFromCart(id);
  };

  const resetCart = () => {
    rootStore.cart.resetCart();
  };

  return (
    <div className={cls.Cart}>
      <h2>Products in your cart</h2>
      {rootStore.cart.cartItems.length === 0 && (
        <div className="cart__empty">
          <p>Your cart is empty.</p>
        </div>
      )}
      {rootStore.cart.cartItems?.map((product: ProductModel) => (
        <div className={cls.product} key={product.id}>
          <img
            className={cls.product_image}
            src={product.images[0]}
            alt={product.title}
          />
          <div className={cls.detail}>
            <h2 className={cls.title}>{product.title}</h2>
            <p>{product.description.substring(0, 20)}</p>
            <div className={cls.price}>1 x ${product.price}</div>
          </div>
          <img
            className={cls.trash}
            src={TrashIcon}
            alt="trash"
            onClick={() => deleteItem(product.id)}
          />
        </div>
      ))}
      <div className={cls.total}>
        <span>SUBTOTAL</span>
        <span>${rootStore.cart.subtotal.toFixed(2)}</span>
      </div>
      <Button className={cls.checkout_btn}>PROCEED TO CHECKOUT</Button>
      <span className={cls.reset} onClick={resetCart}>
        Reset Cart
      </span>
    </div>
  );
});

export default memo(Cart);
