"use client";
import { useId } from "react";
import { motion, useReducedMotion } from "motion/react";
export function Segmented({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  const id = useId();
  const reduced = useReducedMotion();
  return (
    <div>
      <p className="text-xs text-muted mb-2">{label}</p>
      <div role="group" aria-label={label} className="segments w-full">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className="relative flex-1"
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
          >
            {value === option.value && (
              <motion.span
                layoutId={reduced ? undefined : id}
                className="segment-indicator"
              />
            )}
            <span className="relative">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
