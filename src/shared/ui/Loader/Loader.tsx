import LoaderL from "@shared/assets/Loader-l.svg";
import LoaderM from "@shared/assets/Loader-m.svg";
import LoaderS from "@shared/assets/Loader-s.svg";
import cn from "classnames";

import cls from "./Loader.module.scss";

export enum LoaderSize {
  s = "s",
  m = "m",
  l = "l",
}

export type LoaderProps = {
  loading?: boolean;
  size?: LoaderSize;
  className?: string;
};

export const Loader: React.FC<LoaderProps> = ({
  loading = true,
  size = LoaderSize.m,
  className,
}) => {
  return (
    <>
      {loading && size === "l" && (
        <img className={cn(cls.Loader, className)} src={LoaderL} alt="loader" />
      )}
      {loading && size === "m" && (
        <img className={cn(cls.Loader, className)} src={LoaderM} alt="loader" />
      )}
      {loading && size === "s" && (
        <img className={cn(cls.Loader, className)} src={LoaderS} alt="loader" />
      )}
    </>
  );
};
