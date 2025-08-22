import React from "react";
import "./info-badge-styles.scss";
import type { InfoBadgeProps } from "../../models/components";
import Tooltip from "../Tooltip/Tooltip";

const InfoBadge: React.FC<InfoBadgeProps> = ({
  tooltip,
  text,
  icon,
  style,
}) => {
  return (
    <Tooltip {...tooltip}>
      <div className="infoBadge-wrapper" style={style}>
        {text && <p className="infoBadge-text">{text}</p>}
        {icon && <div className="infoBadge-icon">{icon}</div>}
      </div>
    </Tooltip>
  );
};

export default InfoBadge;
