import { ColorPickerProps } from "@app/models/components";
import React, { CSSProperties, useEffect, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";
import "./color-picker-styles.scss";

const ColorPicker: React.FC<ColorPickerProps> = ({
  name,
  label,
  placeholder,
  value,
  onChange,
}) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  const handleColorChange = (color: string) => {
    onChange?.(name, color);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      colorPickerRef.current &&
      !colorPickerRef.current.contains(event.target as Node)
    ) {
      setIsPickerOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const pickerStyles: CSSProperties = {
    ...(!isPickerOpen && { display: "none" }),
  };

  const previewStyles: CSSProperties = {
    ...(value && { backgroundColor: value }),
  };

  return (
    onChange && (
      <div className="colorPicker-root">
        {label && <label htmlFor={name}>{label}</label>}
        <button
          onClick={() => setIsPickerOpen(true)}
          className="colorPicker-button"
        >
          <span
            className="colorPicker-colorPreview"
            style={previewStyles}
          ></span>
          <input
            name={name}
            value={value}
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            placeholder={placeholder}
            onChange={(e) => handleColorChange(e.target.value)}
          />
        </button>
        <div
          ref={colorPickerRef}
          className="colorPicker-pickerWrapper"
          style={pickerStyles}
        >
          <HexColorPicker color={value} onChange={handleColorChange} />
        </div>
      </div>
    )
  );
};

export default ColorPicker;
