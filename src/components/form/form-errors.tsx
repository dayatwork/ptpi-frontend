import { cn } from "@/lib/utils";

export function FormErrors({
  error,
  className,
}: {
  error: string;
  className?: string;
}) {
  if (!error) return null;

  return (
    <em
      role="alert"
      className={cn(
        "font-semibold px-3 py-1 border border-red-600/20 text-red-600 bg-red-600/10 rounded text-sm block text-center",
        className
      )}
    >
      {error}
    </em>
  );
}
