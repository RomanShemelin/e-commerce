import React, { FC } from "react";

import cn from "classnames";

import cls from "./Input.module.scss";

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> & {
  value: string;
  onChange: (value: string) => void;
};
export const Input: FC<InputProps> = (props) => {
  const { className, value, onChange, disabled, ...otherProps } = props;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <>
      {disabled ? (
        <input
          className={cn(className, cls.input, cls.input_disabled)}
          type="text"
          value={value}
          disabled
          {...otherProps}
        />
      ) : (
        <input
          className={cn(className, cls.input)}
          type="text"
          value={value}
          onChange={handleChange}
          {...otherProps}
        />
      )}
    </>
  );
};
