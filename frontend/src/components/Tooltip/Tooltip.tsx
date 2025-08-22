import React, { useState, type CSSProperties } from "react";
import "./tooltip-styles.scss";
import type { TooltipProps } from "../../models/components";

const Tooltip: React.FC<TooltipProps> = ({
  text = "",
  width,
  gap,
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  let hoverTimeout: ReturnType<typeof setTimeout>;

  const showTooltip = () => {
    hoverTimeout = setTimeout(() => {
      setIsVisible(true);
    }, 100);
  };

  const hideTooltip = () => {
    clearTimeout(hoverTimeout);
    setIsVisible(false);
  };

  const styles: CSSProperties = {
    ...(width && { width }),
    ...(gap && { top: `calc(100% + ${gap}px)` }),
  };

  return (
    <div
      className="tooltip-container"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      {isVisible && text && (
        <div style={styles} className="tooltip">
          <span>{text}</span>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
