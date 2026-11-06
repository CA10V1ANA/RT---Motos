import { cn } from "@/lib/utils";
export function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("form-field", className)}>
      <span>{label}</span>
      {children}
    </label>
  );
}
export function Select(props: React.ComponentProps<"select">) {
  return <select {...props} className={cn("field", props.className)} />;
}
export function Textarea(props: React.ComponentProps<"textarea">) {
  return (
    <textarea {...props} className={cn("field min-h-28", props.className)} />
  );
}
