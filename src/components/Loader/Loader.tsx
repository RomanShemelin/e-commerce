import LoaderL from "@icons/Loader-l.svg";
import LoaderM from "@icons/Loader-m.svg";
import LoaderS from "@icons/Loader-s.svg";
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
  const loaderImage = {
    [LoaderSize.s]: LoaderS,
    [LoaderSize.m]: LoaderM,
    [LoaderSize.l]: LoaderL,
  };
  return (
    <>
      {loading && size && (
        <img
          className={cn(cls.Loader, className)}
          src={loaderImage[size]}
          alt="loader"
        />
      )}
    </>
  );
};
