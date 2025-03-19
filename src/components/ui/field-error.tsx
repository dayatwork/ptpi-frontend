import { cn } from "@/lib/utils";

export function FieldError({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <em
      role="alert"
      className={cn("text-sm text-red-600 leading-0 block mt-1", className)}
    >
      {children}
    </em>
  );
}
