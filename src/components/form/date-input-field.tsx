import { useFieldContext } from ".";
import RADateInput from "../ra-ui/date-input";
import { FieldErrors } from "./field-errors";

interface DateInputFieldProps {
  label: string;
  minValue?: Date;
  maxValue?: Date;
}

export function DateInputField({
  label,
  maxValue,
  minValue,
}: DateInputFieldProps) {
  const field = useFieldContext<Date>();

  return (
    <div className="grid gap-1">
      <RADateInput
        hideTimeZone
        hourCycle={24}
        label={label}
        granularity="second"
        name={field.name}
        value={field.state.value}
        onChange={(v) => {
          if (v) field.handleChange(v);
        }}
        maxValue={maxValue}
        minValue={minValue}
        isInvalid={field.state.meta.errors.length > 0}
      />
      <FieldErrors meta={field.state.meta} />
    </div>
  );
}
