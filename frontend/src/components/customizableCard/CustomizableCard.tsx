import React from "react";
import { CustomizableCardProps } from "../../models/components";
import "./customizableCard.scss";
import Button from "../button/Button";
import clsx from "clsx";
import { defaultElementStyling } from "@app/constants";

const CustomizableCard: React.FC<CustomizableCardProps> = ({
  title,
  body,
  type,
  category,
  date,
  tags = [],
  image,
  href,
  rtl,
  actionButtons = [],
  dimmed,
  score,
  styling = defaultElementStyling,
  isCustomizable,
  onElementClickHandler,
  lazyLoad = false,
  isWidget = false,
  isFrontend = false
}) => {
  if (!title || !href) return null;

  const hasActionButtons =
    Array.isArray(actionButtons) && actionButtons.length > 0;
  const hasTags = Array.isArray(tags) && tags.length > 0;

  const handleClick = (elementName: string) => () => {
    if (isCustomizable && onElementClickHandler) {
      onElementClickHandler(elementName);
    }
  };

  const combinedStyles = { ...defaultElementStyling, ...styling };

  return (
    <div
      className={clsx(
        "CustomizableCard-cardContainer",
        rtl && "CustomizableCard-cardContainer--rtl",
        hasActionButtons && "CustomizableCard-cardContainer--withActions"
      )}
    >
      <div
        className={clsx(
          !dimmed && "CustomizableCard-hoverBackground",
          dimmed && "CustomizableCard-dimmedOverlay"
        )}
      ></div>
      {hasActionButtons && (
        <div className="CustomizableCard-hoverContainer">
          <div className="CustomizableCard-actionButtonsContainer">
            {actionButtons.map((button, index) => (
              <Button key={index} {...button} />
            ))}
          </div>
          {score && (
            <div className="CustomizableCard-score">
              <div className="CustomizableCard-scoreLine"></div>
              <div className="CustomizableCard-scoreText">{score}</div>
            </div>
          )}
        </div>
      )}
      <div className="CustomizableCard-cardBodyContainer">
        <div className="CustomizableCard-category-type-container">
          {category && (
            <div
              className="CustomizableCard-category"
              style={combinedStyles?.category}
              onClick={handleClick("category")}
            >
              {category}
            </div>
          )}
          {type && (
            <>
              {category && <span className="CustomizableCard-separator"></span>}
              <div>{type}</div>
            </>
          )}
        </div>

        <a
          className={`CustomizableCard-title ${isFrontend && isWidget ? "GATopPostWidgetCard" : "GATopPostPageCard"}`}
          {...(!isCustomizable ? { href: href } : {})}
          style={combinedStyles?.title}
          onClick={handleClick("title")}
        >
          {title}
        </a>
        {(date || body) && (
          <div className="CustomizableCard-dateAndBody">
            {date && (
              <span
                className="CustomizableCard-date"
                style={combinedStyles?.date}
                onClick={handleClick("date")}
              >
                {date}
              </span>
            )}
            {date && body && (
              <span className="CustomizableCard-bodySeparator">—</span>
            )}
            {body && (
              <span
                className="CustomizableCard-body"
                style={combinedStyles?.body}
                onClick={handleClick("body")}
              >
                {body}
              </span>
            )}
          </div>
        )}
        {hasTags && (
          <div className="CustomizableCard-tagsContainer">
            {tags.slice(0, 4).map(
              (tag, index) =>
                tag.label &&
                tag.href && (
                  <React.Fragment key={`${tag.label}-${index}`}>
                    <a
                      className="CustomizableCard-clickableTag"
                      {...(!isCustomizable ? { href: tag.href } : {})}
                      style={combinedStyles?.tags}
                      onClick={handleClick("tags")}
                    >
                      {tag.label}
                    </a>
                    {index < 3 && index < tags.slice(0, 4).length - 1 && (
                      <span className="CustomizableCard-tagSeparator"></span>
                    )}
                  </React.Fragment>
                )
            )}
          </div>
        )}
      </div>
      {image && (
        <a
          className="CustomizableCard-imageWrapper"
          {...(!isCustomizable ? { href: href } : {})}
        >
          <img
            className="CustomizableCard-image"
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

export default CustomizableCard;
