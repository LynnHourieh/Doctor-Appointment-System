import React from "react";
import { NavLink } from "react-router-dom";
import { NavItemProps } from "@app/models/components";

const NavItem: React.FC<NavItemProps> = ({
  onClick,
  icon,
  text,
  to,
  disabled,
}) => {
  return (
    <div className={`nav-item ${disabled ? "navItem-disabled" : ""}`}>
      <NavLink onClick={onClick} to={to ?? "/"}>
        {icon}
        <p>{text}</p>
      </NavLink>
    </div>
  );
};

export default NavItem;
