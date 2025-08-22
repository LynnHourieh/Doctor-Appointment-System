import React from "react";
import "./button-styles.scss";
import { Oval } from "react-loader-spinner";
import type { ButtonProps } from "../../models/components";

const Button: React.FC<ButtonProps> = ({
  id = "",
  onClickHandler,
  text,
  type = "button",
  disabled = false,
  variant,
  isDestructive,
  isLoading,
  icon,
  iconPosition = "start",
  shape = "boxy",
  style = {},
  size = "md",
  collapse,
  flagIcon,
  onMouseDownHandler,
}) => {
  let buttonClassName = "button-root";

  if (variant === "tertiary") {
    buttonClassName += " tertiary-button";
  } else if (variant === "secondary") {
    buttonClassName += " secondary-button";
  } else if (variant === "ghost") {
    buttonClassName += " ghost-button";
  } else if (variant === "text") {
    buttonClassName += " text-button";
  }

  if (isDestructive) {
    buttonClassName += " destructive-button";
  }

  if (shape === "rounded") {
    buttonClassName += " rounded-button";
  }

  if (shape === "circular") {
    buttonClassName += " circular-button";
  }

  if (size === "lg") {
    buttonClassName += " large-button";
  }

  if (collapse) {
    buttonClassName += " collapse";
  }

  return (
    <>
      {(onClickHandler || type === "submit") && (text || icon) && (
        <div className="button-container">
          <button
            id={id}
            disabled={disabled}
            onClick={onClickHandler}
            className={buttonClassName}
            type={type}
            style={style}
            onMouseDown={onMouseDownHandler} // Added onMouseDown here
          >
            {iconPosition === "start" && icon}
            {text}
            {iconPosition === "end" && icon}

            {flagIcon && <div className="button-flagIcon">{flagIcon}</div>}
            {isLoading && (
              <Oval
                height={13}
                width={13}
                color="#878787"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                ariaLabel="oval-loading"
                secondaryColor="#878787"
                strokeWidth={6}
                strokeWidthSecondary={6}
              />
            )}
          </button>
        </div>
      )}
    </>
  );
};

export default Button;
