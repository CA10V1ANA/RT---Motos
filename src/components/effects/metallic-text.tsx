import { cn } from "@/lib/utils";
export function MetallicText({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <span className={cn("metallic-text", className)}>{children}</span>;
}
