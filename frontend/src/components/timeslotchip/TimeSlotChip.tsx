import "./timeslotchip-styles.scss";
import type { TimeSlotChipProps } from "../../models/components";
export default function TimeSlotChip({
  label = "10:00",
  selected = false,
  disabled = false,
  onClick,
}: TimeSlotChipProps) {
  return (
    <button
      type="button"
      className={`tsc-chip ${selected ? "tsc-chip--selected" : ""}`}
      disabled={disabled}
      aria-pressed={selected}
      title={label}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
