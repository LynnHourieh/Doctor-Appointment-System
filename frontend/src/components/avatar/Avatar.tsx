import type { AvatarProps } from "../../models/components";
import React from "react";
import "./avatar-style.scss";
import { AvatarIcon } from "../../assets/images/icons";

const Avatar: React.FC<AvatarProps> = ({
  alt = "",
  classes = [],
  src = "",
  size = "md",
  placeholderIcon = AvatarIcon,
}) => {
  const sizeMapping = {
    sm: "avatar-sm",
    md: "avatar-md",
    lg: "avatar-lg",
  };

  return (
    <div className={`avatar-root ${classes.join(" ")} ${sizeMapping[size]}`}>
      {src ? <img src={src} alt={alt} /> : placeholderIcon}
    </div>
  );
};

export default Avatar;
