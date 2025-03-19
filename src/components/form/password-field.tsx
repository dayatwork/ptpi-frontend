import { useFieldContext } from ".";
import { Label } from "../ui/label";
import { PasswordInput } from "../ui/password-input";
import { FieldErrors } from "./field-errors";

interface PasswordFieldProps {
  label: string;
}

export function PasswordField({ label }: PasswordFieldProps) {
  const field = useFieldContext<string>();

  return (
    <div className="grid gap-1 flex-1">
      <Label htmlFor={field.name}>{label}</Label>
      <PasswordInput
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
