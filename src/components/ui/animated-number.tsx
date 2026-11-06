"use client";
import NumberFlow from "@number-flow/react";
import { useReducedMotion } from "motion/react";
export function AnimatedNumber({
  value,
  currency = false,
  suffix,
  className = "",
}: {
  value: number;
  currency?: boolean;
  suffix?: string;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const format: Intl.NumberFormatOptions = currency
    ? { style: "currency", currency: "BRL", maximumFractionDigits: 0 }
    : { maximumFractionDigits: 1 };
  const texto =
    new Intl.NumberFormat("pt-BR", format).format(value) + (suffix ?? "");
  return (
    <span className={`font-mono ${className}`}>
      <span className="sr-only">{texto}</span>
      <NumberFlow
        aria-hidden="true"
        value={value}
        locales="pt-BR"
        format={
          currency
            ? { style: "currency", currency: "BRL", maximumFractionDigits: 0 }
            : { maximumFractionDigits: 1 }
        }
        suffix={suffix}
        animated={!reduced}
      />
    </span>
  );
}
