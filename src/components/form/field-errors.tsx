import { AnyFieldMeta } from "@tanstack/react-form";

interface FieldErrorsProps {
  meta: AnyFieldMeta;
}

export function FieldErrors({ meta }: FieldErrorsProps) {
  if (!meta.isTouched || meta.errors.length === 0) return null;

  return (
    <em role="alert" className="leading-none text-sm text-red-600">
      {meta.errors.map((error) => error?.message).join(", ")}
    </em>
  );
}
