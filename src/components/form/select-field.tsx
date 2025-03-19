import { useFieldContext } from ".";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { FieldErrors } from "./field-errors";

interface SelectFieldProps {
  label: string;
  options: {
    label: string;
    value: string;
  }[];
}

export function SelectField({ label, options }: SelectFieldProps) {
  const field = useFieldContext<string>();

  return (
    <div className="grid gap-1">
      <Label htmlFor={field.name}>{label}</Label>
      <Select
        value={field.state.value}
        onValueChange={(v) => field.handleChange(v)}
      >
        <SelectTrigger type="button">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldErrors meta={field.state.meta} />
    </div>
  );
}
