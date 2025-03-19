import { useFieldContext } from ".";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { FieldErrors } from "./field-errors";

interface TextAreaFieldProps {
  label: string;
}

export function TextAreaField({ label }: TextAreaFieldProps) {
  const field = useFieldContext<string>();

  return (
    <div className="grid gap-1">
      <Label htmlFor={field.name}>{label}</Label>
      <Textarea
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
