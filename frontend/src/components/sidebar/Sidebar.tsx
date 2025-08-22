import React, { useState } from "react";
import "./sidebar-style.scss";
import Button from "../button/Button";
import { chervonBack, chervonForward, MenuIcon } from "../../assets/images/icons";
import type { SidebarProps } from "../../models/components";
import { useNavigate } from "react-router-dom";

const Sidebar: React.FC<SidebarProps> = ({ isMobile, navItems, isMobileMenuOpen, setIsMobileMenuOpen, onLogout }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleNavClick = (item: any) => {
    if (item.action === "logout" && onLogout) {
      onLogout();
    } else if (item.url) {
      navigate(item.url);
    }
    if (isMobile) setIsMobileMenuOpen(false);
  };
  return (
    <>
      {isMobile ? (
        <div className="mobile-navbar">

          <div className="menu-icon" onClick={toggleMobileMenu}>
            {MenuIcon}
          </div>
          {isMobileMenuOpen && (
            <ul className="mobile-dropdown">
              {navItems?.map((item) => (
                <li key={item.label} onClick={() => handleNavClick(item)}>
                  <a href={item.url}>{item.label}</a>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
          <div className="sidebar-header">
            <h2>{isCollapsed ? "CP" : "CarePortal"}</h2>
            <Button onClickHandler={toggleSidebar} icon={isCollapsed ? chervonForward : chervonBack} />

          </div>
          <ul className="nav-list">
            {navItems?.map((item) => (
              <li key={item.label} onClick={() => handleNavClick(item)}>
                <a href={item.url}>{item.label}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default Sidebar;
