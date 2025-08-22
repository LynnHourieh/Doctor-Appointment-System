import type { OptionProps } from "../../models/components";
import React from "react";
import "./option-styles.scss";
import Checkbox from "../checkbox/Checkbox";
import clsx from "clsx";

const Option: React.FC<OptionProps> = ({
  id = "",
  value,
  text,
  onClick,
  selected,
  hasCheckbox,
  icon,
  meta,
  action,
  isDestructive,
  iconPosition = "start",
  secondIcon,
}) => {
  const onOptionClick = (event: React.MouseEvent | React.KeyboardEvent) => {
    event.stopPropagation();
    onClick(value);
  };

  const actionText = action?.text;
  const actionUrl = action?.url;
  return (
    <>
      {value && (
        <li
          id={id}
          className={clsx(
            "option-root",
            selected && "option-selected",
            hasCheckbox && "option-hasCheckbox",
            isDestructive && "option-destructive"
          )}
          role="option"
          aria-selected={selected}
          onClick={onOptionClick}
          tabIndex={selected ? 0 : -1}
          onKeyUp={onOptionClick}
        >
          {hasCheckbox && (
            <Checkbox
              label={text}
              onChange={() => {
                onOptionClick({} as React.MouseEvent);
              }}
              checked={!!selected}
            />
          )}
          {!hasCheckbox && (
            <div className="option-textWrapper">
              {iconPosition == "start" && icon}
              {text}
            </div>
          )}
          {!hasCheckbox && selected && (
            <span className="option-checkedIcon">✓</span>
          )}
          {iconPosition == "end" && icon && (
            <span className="option-icon">{icon}</span>
          )}
          {secondIcon && secondIcon}
          {(meta || (actionUrl && actionUrl)) && (
            <div className="option-meta">
              {meta && meta}
              {!!actionUrl && !!actionText && (
                <a
                  href={actionUrl}
                  target="_blank"
                  onClick={(e) => e.stopPropagation()}
                >
                  {actionText}
                </a>
              )}
            </div>
          )}
        </li>
      )}
    </>
  );
};

export default Option;
