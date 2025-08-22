import type { EmptyStateProps } from "../../models/components";
import React from "react";
import "./empty-state-styles.scss";

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  subtitle,
  children,
}) => {
  return (
    <div className="emptyState-root">
      {icon && icon}
      {(title || subtitle) && (
        <span>
          {title && <h3>{title}</h3>}
          {subtitle && <p>{subtitle}</p>}
        </span>
      )}
      {children}
    </div>
  );
};

export default EmptyState;
