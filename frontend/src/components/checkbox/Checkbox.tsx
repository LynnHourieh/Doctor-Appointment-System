import React from "react";
import "./checkbox-styles.scss";
import type { CheckboxProps } from "../../models/components";
import { ErrorIcon } from "../../assets/images/icons";

const Checkbox: React.FC<CheckboxProps> = ({
  name,
  id,
  onChange,
  checked,
  indeterminate,
  label,
  errorMessage,
  disabled,
}) => {
  return (
    <div
      className={`checkbox-wrapper ${label ? "has-label" : ""} ${
        errorMessage ? "checkbox-hasError" : ""
      } ${disabled ? "checkbox-disabled" : ""}`}
    >
      <span className={`checkbox-root ${checked ? "checkbox-checked" : ""}`}>
        <input
          className="checkbox"
          type="checkbox"
          name={name}
          id={`${id || ""}`}
          checked={checked ?? false}
          onChange={onChange}
        />
        {!checked && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 0 24 24"
            width="24"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
          </svg>
        )}
        {checked && indeterminate && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            enable-background="new 0 0 24 24"
            height="24"
            viewBox="0 0 24 24"
            width="24"
          >
            <g>
              <rect fill="none" height="24" width="24" />
            </g>
            <g>
              <g>
                <g>
                  <path d="M19,3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.9,20.1,3,19,3z M17,13H7v-2h10V13z" />
                </g>
              </g>
            </g>
          </svg>
        )}
        {checked && !indeterminate && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 0 24 24"
            width="24"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        )}
      </span>
      {label && <label htmlFor={id}>{label}</label>}
      {errorMessage && (
        <div className="checkbox-errorMessage">
          {ErrorIcon}
          <p>{errorMessage}</p>
        </div>
      )}
    </div>
  );
};

export default Checkbox;
