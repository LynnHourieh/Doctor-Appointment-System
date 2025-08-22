import React, { useEffect, useRef } from "react";
import "./menu-styles.scss";
import { MenuOption, MenuProps } from "@app/models/components";
import Option from "../option/Option";

const Menu: React.FC<MenuProps> = ({
  id = "",
  children,
  options = [],
  open,
  onClose,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose?.();
      }
    };

    if (open) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [open, onClose]);

  const handleMenuOptionClick = (option: MenuOption) => () => {
    option.onClick();
    onClose?.();
  };

  return (
    <>
      {options?.length > 0 && (
        <div ref={menuRef} id={id} className="menu-optionsContainer">
          {children}
          {open && (
            <ul role="listbox" className="menu-optionsList">
              {options.map((option, index) => (
                <Option
                  id="menu-option"
                  key={index}
                  value={option.label}
                  text={option.label}
                  onClick={handleMenuOptionClick(option)}
                  icon={option.icon}
                  isDestructive={option.isDestructive}
                  iconPosition={option.iconPosition}
                  secondIcon={option?.secondIcon}
                />
              ))}
            </ul>
          )}
        </div>
      )}
    </>
  );
};

export default Menu;
