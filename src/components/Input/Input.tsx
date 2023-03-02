import React, { FC, memo } from "react";

import cn from "classnames";

import cls from "./Input.module.scss";

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> & {
  value: string;
  onChange: (value: string) => void;
};
export const Input: FC<InputProps> = memo(
  ({ className, value, onChange, disabled, ...otherProps }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    };

    return (
      <>
        <input
          className={cn(className, cls.input)}
          type="text"
          value={value}
          disabled={disabled}
          onChange={disabled ? undefined : handleChange}
          {...otherProps}
        />
      </>
    );
  }
);
