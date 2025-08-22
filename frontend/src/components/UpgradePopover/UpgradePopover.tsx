import React from "react";
import "./upgradePopover-styles.scss";
import { Popover, PopoverTrigger } from "../popover/Popover";
import { PopoverContent } from "@radix-ui/react-popover";
import { UpgradePopoverProps } from "@app/models/components";

const UpgradePopover: React.FC<UpgradePopoverProps> = ({
  open,
  children,
  content,
  onOpenChange,
}) => {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent asChild>{content}</PopoverContent>
    </Popover>
  );
};

export default UpgradePopover;
