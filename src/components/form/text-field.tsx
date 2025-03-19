import { useFieldContext } from ".";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { FieldErrors } from "./field-errors";

interface TextFieldProps {
  label: string;
}

export function TextField({ label }: TextFieldProps) {
  const field = useFieldContext<string>();

  return (
    <div className="grid gap-1 flex-1">
      <Label htmlFor={field.name}>{label}</Label>
      <Input
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
