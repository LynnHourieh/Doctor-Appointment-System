import React, { CSSProperties } from "react";
import "./skeleton-styles.scss";
import { SkeletonProps } from "@app/models/components";

const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  variant,
  aspectRatio,
  maxWidth = "none",
}) => {
  const style: CSSProperties = {
    width,
    height,
    maxWidth,
  };

  if (variant === "circular") {
    style.borderRadius = "50%";
    style.aspectRatio = "1";
  }

  if (variant === "square") {
    style.aspectRatio = "1";
  }
  if (variant === "rectangular") {
    style.aspectRatio = "2";
  }
  if (aspectRatio) {
    style.aspectRatio = aspectRatio;
  }

  return <span className="skeleton-root" style={style}></span>;
};

export default Skeleton;
