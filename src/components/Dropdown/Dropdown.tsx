import { FC, useState } from "react";

import FilterIcon from "@icons/filter.svg";

import cls from "./Dropdown.module.scss";

export type Option = {
  /** Ключ варианта, используется для отправки на бек/использования в коде */
  key: string;
  /** Значение варианта, отображается пользователю */
  value: string;
};
export type MultiDropdownProps = {
  /** Массив возможных вариантов для выбора */
  options: Option[];
  /** Текущие выбранные значения поля, может быть пустым */
  value: Option[];
  /** Callback, вызываемый при выборе варианта */
  onChange: (value: Option[]) => void;
  /** Заблокирован ли дропдаун */
  disabled?: boolean;
  /** Преобразовать выбранные значения в строку. Отображается в дропдауне в качестве выбранного значения */
  pluralizeOptions: (value: Option[]) => string;
};
export const Dropdown: FC<MultiDropdownProps> = (props) => {
  const { options, value, onChange, disabled, pluralizeOptions } = props;
  const [isOpen, setIsopen] = useState(false);

  function isSelected(selectedOption: Option) {
    return !!value.find((option) => option.key === selectedOption.key);
  }

  function onSelect(selectedOption: Option) {
    if (!isSelected(selectedOption)) {
      onChange([selectedOption]);
    } else onChange([]);
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
        {value.length === 0 ? (
          <>
            <img src={FilterIcon} alt="filter" />
            Filter
          </>
        ) : (
          pluralizeOptions(value)
        )}
      </button>
      {isOpen && !disabled && (
        <ul className={cls.list}>{renderDropDown(options)}</ul>
      )}
    </div>
  );
};
