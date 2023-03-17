import { FC, useState } from "react";

import FilterIcon from "@icons/filter.svg";
import cn from "classnames";

import cls from "./Dropdown.module.scss";

export type Option = {
  key: string;
  value: string;
};
export type DropdownProps = {
  options: Option[];
  value: Option;
  onChange: (value: Option) => void;
  disabled?: boolean;
};
export const Dropdown: FC<DropdownProps> = (props) => {
  const { options, value, onChange, disabled } = props;
  const [isOpen, setIsopen] = useState(false);

  function isSelected(selectedOption: Option) {
    return !!(value.key === selectedOption.key);
  }

  function onSelect(selectedOption: Option) {
    if (!isSelected(selectedOption)) {
      onChange(selectedOption);
    } else onChange({ key: "", value: "" });
  }

  function renderDropDown(options: Option[]) {
    return options.map((option) => (
      <li key={option.key}>
        <input
          type="checkbox"
          id={option.key}
          checked={isSelected(option)}
          onChange={() => onSelect(option)}
        />
        <label className={cls.item} htmlFor={option.key}>
          {option.value}
        </label>
      </li>
    ));
  }

  return (
    <div className={cls.MultiDropdown}>
      <button
        className={cls.button}
        disabled={disabled}
        onClick={() => setIsopen((isOpen) => !isOpen)}
      >
        {!value.key ? (
          <>
            <img src={FilterIcon} alt="filter" />
            Filter
          </>
        ) : (
          value.value
        )}
      </button>
      {!disabled && (
        <ul className={cn(cls.list, { [cls.list_open]: isOpen })}>
          {renderDropDown(options)}
        </ul>
      )}
    </div>
  );
};
