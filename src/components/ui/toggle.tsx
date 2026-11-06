"use client";
import * as Switch from "@radix-ui/react-switch";
export function Toggle({
  label,
  checked,
  onCheckedChange,
}: {
  label: string;
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
}) {
  return (
    <label className="toggle-row">
      <span>{label}</span>
      <Switch.Root
        className="toggle-control"
        checked={checked}
        onCheckedChange={onCheckedChange}
        aria-label={label}
      >
        <Switch.Thumb className="toggle-thumb" />
      </Switch.Root>
    </label>
  );
}
