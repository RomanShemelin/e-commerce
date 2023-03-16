import { memo, useState } from "react";

import { Cart } from "@components/Cart";
import { Modal } from "@components/Modal/Modal";
import BagIcon from "@icons/bag.svg";
import LogoIcon from "@icons/logo.png";
import UserIcon from "@icons/user.svg";
import rootStore from "@store/RootStore/instance";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";

import cls from "./Navbar.module.scss";

const Navbar = observer(() => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className={cls.Navbar}>
        <div className="logo">
          <Link to="/">
            <img src={LogoIcon} alt="logo" />
          </Link>
        </div>
        <div className={cls.content}>
          <Link className={cls.link} to="/">
            <p>Products</p>
          </Link>
          <Link className={cls.link} to="/">
            <p>Categories</p>
          </Link>
          <Link className={cls.link} to="/">
            <p>About Us</p>
          </Link>
        </div>
        <div className={cls.user}>
          <div className={cls.cart} onClick={() => setOpen(true)}>
            <img src={BagIcon} alt="bag" />
            <span>{rootStore.cart.cartItems.length}</span>
          </div>
          <Link to="/">
            <img src={UserIcon} alt="user" />
          </Link>
        </div>
      </div>
      <Modal isOpen={open} onClose={() => setOpen(false)}>
        {<Cart />}
      </Modal>
    </>
  );
});

export default memo(Navbar);
