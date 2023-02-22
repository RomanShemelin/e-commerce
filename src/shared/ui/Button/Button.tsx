import { FC } from "react";

import cn from "classnames";

import cls from "./Button.module.scss";
import { Loader, LoaderSize } from "../Loader";

export type ButtonProps = React.PropsWithChildren<{
  loading?: boolean;
}> &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: FC<ButtonProps> = (props) => {
  const { className, children, loading, disabled, ...otherProps } = props;
  return (
    <>
      {loading ? (
        <button
          className={cn(
            className,
            cls.button,
            cls.button_disabled,
            cls.loading
          )}
          {...otherProps}
          disabled
        >
          <div className={cn(cls.children)}>
            <Loader size={LoaderSize.s} />
            {children}
          </div>
        </button>
      ) : disabled ? (
        <button
          className={cn(className, cls.button, cls.button_disabled)}
          disabled
          {...otherProps}
        >
          {children}
        </button>
      ) : (
        <button className={cn(className, cls.button)} {...otherProps}>
          {children}
        </button>
      )}
    </>
  );
};
