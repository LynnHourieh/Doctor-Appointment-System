import React from "react";
import { TagProps } from "@app/models/components";
import "./tag-styles.scss";

const Tag: React.FC<TagProps> = ({ color, textColor, label }) => {
  if (!label) {
    return null;
  }

  const tagStyle = {
    backgroundColor: color || "purple",
    color: textColor || "white",
  };

  if (color === "yellow") {
    tagStyle.color = "black";
  }

  return (
    <div data-testid="tag__component" className="tag-ctr" style={tagStyle}>
      <p> {label} </p>
    </div>
  );
};

export default Tag;
