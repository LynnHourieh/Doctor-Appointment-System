import React from "react";
import { ResultCardProps } from "../../models/components";
import "./ResultCard.scss";
import Button from "../button/Button";
import clsx from "clsx";

const ResultCard: React.FC<ResultCardProps> = ({
  title,
  body,
  category,
  date,
  tags = [],
  image,
  href,
  rtl,
  actionButtons = [],
  dimmed,
  score,
  type,
  lazyLoad = false,
  isWidget = false,
  isFrontend = false
}) => {
  if (!title || !href) return null;

  const hasActionButtons =
    Array.isArray(actionButtons) && actionButtons.length > 0;
  const hasTags = Array.isArray(tags) && tags.length > 0;

  return (
    <div
      className={clsx(
        "ResultCard-cardContainer",
        rtl && "ResultCard-cardContainer--rtl",
        hasActionButtons && "ResultCard-cardContainer--withActions"
      )}
    >
      <div
        className={clsx(
          !dimmed && "ResultCard-hoverBackground",
          dimmed && "ResultCard-dimmedOverlay"
        )}
      ></div>
      {hasActionButtons && (
        <div className="ResultCard-hoverContainer">
          <div className="ResultCard-actionButtonsContainer">
            {actionButtons.map((button, index) => (
              <Button key={index} {...button} />
            ))}
          </div>
          {score && (
            <div className="ResultCard-score">
              <div className="ResultCard-scoreLine"></div>
              <div className="ResultCard-scoreText">{score}</div>
            </div>
          )}
        </div>
      )}
      <div className="ResultCard-cardBodyContainer">
        <div className="ResultCard-category-type-container">
          {" "}
          {category && <div className="ResultCard-category">{category}</div>}
          {type && (
            <>
              {category && <span className="ResultCard-separator"></span>}
              <div> {type}</div>
            </>
          )}
        </div>

        <a
          className={clsx(
            "ResultCard-title",
            isFrontend && isWidget ? "GATopPostWidgetCard" : "GATopPostPageCard",

            !body && "ResultCard-title--full"
          )}
          href={href}
        >
          {title}
        </a>
        {(date || body) && (
          <div className="ResultCard-dateAndBody">
            {date && <span className="ResultCard-date">{date}</span>}
            {date && body && (
              <span className="ResultCard-bodySeparator">—</span>
            )}
            {body && <span className="ResultCard-body">{body}</span>}
          </div>
        )}
        {hasTags && (
          <div className="ResultCard-tagsContainer">
            {tags.slice(0, 4).map(
              (tag, index) =>
                tag.label &&
                tag.href && (
                  <React.Fragment key={`${tag.label}-${index}`}>
                    <a className="ResultCard-clickableTag" href={tag.href}>
                      {tag.label}
                    </a>
                    {index < 3 && index < tags.slice(0, 4).length - 1 && (
                      <span className="ResultCard-tagSeparator"></span>
                    )}
                  </React.Fragment>
                )
            )}
          </div>
        )}
      </div>
      {image && (
        <a className="ResultCard-imageWrapper" href={href}>
          <img
            className="ResultCard-image"
            src={image}
            loading={lazyLoad ? "lazy" : undefined}
            width="90"
            height="90"
          />
        </a>
      )}
    </div>
  );
};

export default ResultCard;
