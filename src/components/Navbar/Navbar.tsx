import BagIcon from "@icons/bag.svg";
import LogoIcon from "@icons/logo.png";
import UserIcon from "@icons/user.svg";
import { Link } from "react-router-dom";

import cls from "./Navbar.module.scss";

export default function Navbar() {
  return (
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
        <Link to="/">
          <img src={BagIcon} alt="bag" />
        </Link>
        <Link to="/">
          <img src={UserIcon} alt="user" />
        </Link>
      </div>
    </div>
  );
}
