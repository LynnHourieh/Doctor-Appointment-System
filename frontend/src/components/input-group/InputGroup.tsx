import React from "react";
import "./input-group-styles.scss";
import { InputGroupProps } from "@app/models/components";

const InputGroup: React.FC<InputGroupProps> = ({
  groupTitle,
  groupInfo,
  children,
}) => {
  return (
    <div className="inputGroup-root">
      <div className="inputGroup-header">
        {groupTitle && <p className="inputGroup-title">{groupTitle}</p>}
        {groupInfo && <p className="inputGroup-info">{groupInfo}</p>}
      </div>
      <div className="inputGroup-elements">{children}</div>
    </div>
  );
};

export default InputGroup;
