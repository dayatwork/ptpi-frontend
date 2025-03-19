import { useFieldContext } from ".";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { FieldErrors } from "./field-errors";

interface EmailFieldProps {
  label: string;
}

export function EmailField({ label }: EmailFieldProps) {
  const field = useFieldContext<string>();

  return (
    <div className="grid gap-1 flex-1">
      <Label htmlFor={field.name}>{label}</Label>
      <Input
        type="email"
        id={field.name}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      <FieldErrors meta={field.state.meta} />
    </div>
  );
}
