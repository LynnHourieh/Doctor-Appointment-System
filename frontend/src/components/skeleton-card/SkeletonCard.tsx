import React from "react";
import "./skeletonCard-styles.scss";
import Skeleton from "../skeleton/Skeleton";
import { SkeletonCardProps } from "@app/models/components";

const SkeletonCard: React.FC<SkeletonCardProps> = ({ variant }) => {
  return (
    <div className="skeleton-card-container">
      <div className="skeleton-card">
        <div className="skeleton-card-header">
          <Skeleton width="15%" height="15px" variant="rectangular" />
        </div>

        <div className="skeleton-card-title">
          <Skeleton
            width="90%"
            height={variant == "fancy_card" ? "30px" : "15px"}
            variant="rectangular"
          />
        </div>

        {variant !== "fancy_card" && (
          <>
            <div className="skeleton-card-content">
              <Skeleton width="90%" height="50px" variant="rectangular" />
            </div>
            <div className="skeleton-card-tag">
              <Skeleton width="40%" height="15px" variant="rectangular" />
            </div>
          </>
        )}
      </div>
      <div className="skeleton-card-image">
        <Skeleton width="100%" height="100px" variant="square" />
      </div>
    </div>
  );
};

export default SkeletonCard;
