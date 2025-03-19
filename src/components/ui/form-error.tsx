import { cn } from "@/lib/utils";

export function FormError({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <em
      role="alert"
      className={cn(
        "font-semibold px-3 py-1 border border-red-600/20 text-red-600 bg-red-600/10 rounded text-sm block text-center",
        className
      )}
    >
      {children}
    </em>
  );
}
