import { useFieldContext } from ".";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { FieldErrors } from "./field-errors";

interface CheckboxFieldProps {
  label: string;
  description?: string;
}

export function CheckboxField({ label, description }: CheckboxFieldProps) {
  const field = useFieldContext<boolean>();

  return (
    <div className="grid gap-1">
      <div className="flex items-center gap-2">
        <Checkbox
          id={field.name}
          checked={field.state.value}
          onCheckedChange={(checked) => {
            field.handleChange(checked === true);
          }}
          onBlur={field.handleBlur}
        />
        <div className="grid gap-1.5 leading-none">
          <Label htmlFor={field.name}>{label}</Label>
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
      </div>

      <FieldErrors meta={field.state.meta} />
    </div>
  );
}
