import React from "react";
import "./selectable-chip-styles.scss";
import { SelectableChipProps } from "@app/models/components";
import { CheckCircleIcon } from "@app/assets/images/icons";

const SelectableChip: React.FC<SelectableChipProps> = ({
  id = "",
  label,
  selected = false,
  onSelect,
  disabled,
  icon,
  iconPosition = "start",
}) => {
  const handleClick = () => {
    if (onSelect) {
      onSelect(!selected);
    }
  };
  return (
    label && (
      <div
        id={id}
        className={`selectableChip-root ${
          selected ? "selectableChip-selected" : ""
        }  ${disabled ? "selectableChip-disabled" : ""}`}
        onClick={!disabled ? handleClick : () => {}}
      >
        <div className="selectableChip">
          {selected && (
            <div className="selectableChip-iconContainer">
              {CheckCircleIcon}
            </div>
          )}
          {icon && iconPosition === "start" && icon}
          {label}
          {icon && iconPosition === "end" && icon}
        </div>
      </div>
    )
  );
};

export default SelectableChip;
