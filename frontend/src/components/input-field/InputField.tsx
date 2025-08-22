import React, { useState, type ChangeEvent, type CSSProperties, useRef } from "react";
import "./input-field-styles.scss";
import type { InputFieldProps, TooltipProps } from "../../models/components";
import InfoBadge from "../info-badge/info-badge";
import {
  ErrorIcon,
  HelpIcon,
  VisibilityOffIcon,
  VisibilityOnIcon,
} from "../../assets/images/icons";

const InputField: React.FC<InputFieldProps> = ({
  containerID,
  name,
  type = "text",
  label,
  placeholder,
  isRow,
  value,
  onChange,
  errorMessage,
  description,
  concatenatedString,
  disabled,
  onBlur,
  onFocus,
}) => {
  const isPassword = type === "password";
  const [passwordVisible, setPasswordVisible] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const inputType = passwordVisible ? "text" : type;
  const passwordIcon = passwordVisible ? VisibilityOffIcon : VisibilityOnIcon;

  const InfoBadgeStyle: CSSProperties = {
    backgroundColor: "transparent",
    color: "#868686",
  };

  const tooltipProps: TooltipProps = { text: description };

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(name ?? "", e.target.value);
  };

  const handleInputFocus = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div
      className={`inputField-root ${isRow ? "inputField-rowLayout" : ""}`}
      id={containerID}
    >
      {label && (
        <div className="inputField-labelWrapper">
          <label htmlFor={name}>{label}</label>
          {description && (
            <InfoBadge
              icon={HelpIcon}
              tooltip={tooltipProps}
              style={InfoBadgeStyle}
            />
          )}
        </div>
      )}
      <div
        className={`inputField-inputWrapper ${
          concatenatedString && "inputField-hasConcatString"
        } ${errorMessage ? "inputField-hasError" : ""} `}
      >
        {concatenatedString && (
          <div className="inputField-concatString" onClick={handleInputFocus}>
            {concatenatedString}
          </div>
        )}
        <input
          ref={inputRef}
          className={`${isPassword ? "inputField-isPassword" : ""}  ${
            disabled ? "inputField-disabled" : ""
          }`}
          placeholder={placeholder}
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          name={name}
          id={name}
          type={inputType}
          value={value}
          onChange={handleOnChange}
          onBlur={onBlur}
          onFocus={onFocus}
        />
        {isPassword && (
          <button type="button" onClick={togglePasswordVisibility}>
            {passwordIcon}
          </button>
        )}
      </div>
      {errorMessage && (
        <div className="inputField-errorMessage">
          {ErrorIcon}
          <p>{errorMessage}</p>
        </div>
      )}
    </div>
  );
};

export default InputField;
