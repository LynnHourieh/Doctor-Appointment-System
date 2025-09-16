import React, { useState } from "react";
import type { ChangeEvent } from "react";

import "./number-input-styles.scss";
import type { NumberInputProps } from "../../models/components";
import { ErrorIcon } from "../../assets/images/icons";

const NumberInput: React.FC<NumberInputProps> = ({
  id,
  name,
  label,
  disabled,
  value,
  min,
  max,
  onChange,
  placeholder,
  onClear,
  errorMessage,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      onChange(name, null);

      return;
    }

    const numericValue = parseInt(e.target.value, 10);
    if (!isNaN(numericValue)) {
      const clampedValue = Math.min(
        Math.max(numericValue, min || -Infinity),
        max || Infinity
      );
      onChange(name, clampedValue);
    }
  };

  const handleIncrement = () => {
    const numericValue = parseInt(String(value ?? "0"), 10);
    if (!isNaN(numericValue) && (max === undefined || numericValue < max)) {
      onChange(name, numericValue + 1);
    }
  };

  const handleDecrement = () => {
    const numericValue = parseInt(String(value ?? "0"), 10);
    if (!isNaN(numericValue) && (min === undefined || numericValue > min)) {
      onChange(name, numericValue - 1);
    }
  };

  const handleRootDivClick = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className="numberInput-root">
      {(label || onClear) && (
        <div className="numberInput-wrapper">
          {label && <label htmlFor={name}>{label} </label>}
          {onClear && value && (
            <button
              type="button"
              onClick={onClear}
              className="numberInput-clearButton"
              disabled={disabled}
            >
              Clear
            </button>
          )}
        </div>
      )}

      <div
        className={`numberInput-buttonWrapper ${
          disabled ? "numberInput-disabled" : ""
        }`}
      >
        <div
          aria-label="Number input"
          className={`numberInput ${
            isFocused && !errorMessage ? "numberInput-focused" : ""
          } ${errorMessage ? "numberInput-hasError" : ""}`}
        >
          <button
            aria-controls={id}
            tabIndex={-1}
            disabled={disabled || value == min}
            className="numberInput-decrementButton"
            onClick={handleDecrement}
            type="button"
          >
            ▾
          </button>
          <button
            aria-controls={id}
            tabIndex={-1}
            disabled={disabled || value == max}
            className="numberInput-incrementButton"
            onClick={handleIncrement}
            type="button"
          >
            ▴
          </button>
          <input
            type="text"
            id={id}
            name={name}
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            disabled={disabled}
            placeholder={placeholder}
            className="numberInput-input css-336v5f"
            value={value ?? ""}
            onChange={handleInputChange}
            onBlur={handleBlur}
            onClick={handleRootDivClick}
          />
          {errorMessage && (
            <div className="numberInputField-errorMessage">
              {ErrorIcon}
              <p>{errorMessage}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NumberInput;
