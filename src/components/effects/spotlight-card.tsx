"use client";
import { useRef } from "react";
import { cn } from "@/lib/utils";
export function SpotlightCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      className={cn("surface spotlight rounded-2xl", className)}
      onPointerMove={(e) => {
        if (
          e.pointerType !== "mouse" ||
          window.matchMedia("(prefers-reduced-motion: reduce)").matches
        )
          return;
        const r = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        e.currentTarget.style.setProperty("--spot-x", `${x}px`);
        e.currentTarget.style.setProperty("--spot-y", `${y}px`);
        e.currentTarget.style.transform = `perspective(900px) rotateX(${-(y / r.height - 0.5) * 4}deg) rotateY(${(x / r.width - 0.5) * 4}deg)`;
      }}
      onPointerLeave={() => {
        if (ref.current) ref.current.style.transform = "";
      }}
    >
      {children}
    </div>
  );
}
