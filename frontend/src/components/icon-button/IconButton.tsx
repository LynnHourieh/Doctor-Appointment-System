import { IconButtonProps } from "@app/models/components";
import React from "react";
import "./icon-button-styles.scss";

const IconButton: React.FC<IconButtonProps> = ({
  id = "",
  onClickHandler,
  disabled,
  isDestructive,
  icon,
  color = "default",
  size = "md",
}) => {
  const sizeMapping = {
    sm: "iconButton-sm",
    md: "iconButton-md",
    lg: "iconButton-lg",
  };

  const colorMapping = {
    default: "iconButton-colorDefault",
    primary: "iconButton-colorPrimary",
    secondary: "iconButton-colorSecondary",
  };

  return (
    icon &&
    onClickHandler && (
      <button
        id={id}
        disabled={disabled}
        className={`iconButton-root ${sizeMapping[size]} ${
          colorMapping[color]
        } ${isDestructive ? "iconButton-destructive" : ""}`}
        onClick={onClickHandler}
        type="button"
      >
        {icon}
      </button>
    )
  );
};

export default IconButton;
