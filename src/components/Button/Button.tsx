import { FC, memo } from "react";

import cn from "classnames";

import cls from "./Button.module.scss";
import { Loader, LoaderSize } from "../Loader";

export type ButtonProps = React.PropsWithChildren<{
  loading?: boolean;
}> &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: FC<ButtonProps> = memo(
  ({ className, children, loading, disabled, ...otherProps }) => (
    <button
      className={cn(
        className,
        cls.button,
        loading && cls.loading,
        disabled && cls.button_disabled
      )}
      disabled={loading || disabled}
      {...otherProps}
    >
      {loading ? (
        <div className={cls.children}>
          <div>
            <Loader size={LoaderSize.s} />
          </div>
          <div>{children}</div>
        </div>
      ) : (
        children
      )}
    </button>
  )
);
