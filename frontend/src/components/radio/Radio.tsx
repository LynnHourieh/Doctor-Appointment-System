import { RadioChecked, RadioUnchecked } from "../../assets/images/icons";
import type { RadioProps } from "../../models/components";
import React, { useId } from "react";
import "./radio-styles.scss";

const Radio: React.FC<RadioProps> = ({
  name,
  containerID = "",
  onChange,
  value,
  checked,
  label,
  size = "md",
  icons,
  rightIcon,
}) => {
  const sizeMapping = {
    sm: "radio-sm",
    md: "radio-md",
    lg: "radio-lg",
  };

  const inputID = useId();

  const checkedIcon = icons?.checkedIcon || RadioChecked;
  const uncheckedIcon = icons?.uncheckedIcon || RadioUnchecked;

  return (
    <div
      id={containerID}
      className={`radio-wrapper ${label ? "has-label" : ""}`}
    >
      <span
        className={`radio-root ${
          checked ? "radio-checked" : "radio-unchecked"
        }`}
      >
        <input
          id={inputID}
          className="radio"
          type="radio"
          name={name}
          value={value}
          checked={checked ?? false}
          onChange={onChange}
        />
        <span className={`radio-icon ${sizeMapping[size]}`}>
          {checked ? checkedIcon : uncheckedIcon}
        </span>
      </span>
      {label && <label htmlFor={inputID}>{label}</label>}
      {rightIcon}
    </div>
  );
};

export default Radio;
