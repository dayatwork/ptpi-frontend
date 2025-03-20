import { CalendarIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { setMilliseconds } from "date-fns";
import {
  DateField,
  DateInput,
  DateSegment,
  Label,
} from "react-aria-components";
import {
  parseAbsolute,
  parseDateTime,
  type DateValue,
  getLocalTimeZone,
  now,
} from "@internationalized/date";
import { cn } from "@/lib/utils";
import { inputClass } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";

export default function RADateInput({
  label,
  name,
  onChange,
  value,
  defaultValue,
  granularity = "day",
  hideTimeZone,
  hourCycle,
  maxValue,
  minValue,
  optional,
  clearable,
  isInvalid,
}: {
  label?: string;
  name?: string;
  value?: Date | null;
  onChange?: (v: Date | undefined | null) => void;
  defaultValue?: Date | null;
  granularity?: "day" | "hour" | "minute" | "second";
  hideTimeZone?: boolean;
  hourCycle?: 12 | 24;
  minValue?: Date;
  maxValue?: Date;
  optional?: boolean;
  clearable?: boolean;
  isInvalid?: boolean;
}) {
  const [_value, _setValue] = useState<Date | undefined | null>(defaultValue);
  const [dateInput, setDateInput] = useState<DateValue | undefined | null>(
    defaultValue
      ? convertDateToDateValue(defaultValue)
      : value
        ? convertDateToDateValue(new Date(value))
        : undefined
  );

  const date = value ? new Date(value) : _value;

  useEffect(() => {
    if (value) {
      setDateInput(convertDateToDateValue(new Date(value)));
    } else {
      setDateInput(null);
    }
  }, [value]);

  return (
    <>
      {name && date ? (
        <input
          type="hidden"
          name={name}
          value={setMilliseconds(date, 0).toISOString() ?? undefined}
        />
      ) : null}
      <DateField
        hideTimeZone={hideTimeZone}
        hourCycle={hourCycle}
        granularity={granularity}
        className="grid gap-1 flex-1"
        value={dateInput || null}
        onChange={(v) => {
          setDateInput(v ?? undefined);
          if (v) {
            const d = convertDateValueToDate(v);
            if (onChange) {
              onChange(setMilliseconds(d, 0));
            } else {
              _setValue(setMilliseconds(d, 0));
            }
          }
        }}
        minValue={minValue ? convertDateToDateValue(minValue) : undefined}
        maxValue={maxValue ? convertDateToDateValue(maxValue) : undefined}
        // isInvalid={isInvalid}
      >
        {label ? (
          <div className="flex justify-between items-center">
            <Label className="text-sm font-medium text-foreground leading-none">
              {label}
            </Label>
            {optional && (
              <span className="text-sm text-muted-foreground leading-none">
                optional
              </span>
            )}
          </div>
        ) : null}
        <div className="relative">
          <DateInput
            className={cn(
              inputClass,
              "read-only:bg-transparent read-only:text-foreground flex items-center data-[focus-within]:border data-[disabled]:opacity-50 data-[focus-within]:outline-none data-[focus-within]:ring-[3px] data-[focus-within]:ring-ring/50 outline-none"
            )}
          >
            {(segment) => (
              <DateSegment
                segment={segment}
                className={cn(
                  "inline rounded p-0.5 text-foreground caret-transparent outline-0 data-[disabled]:cursor-not-allowed data-[focused]:bg-primary/30 data-[invalid]:data-[focused]:bg-destructive/20 data-[type=literal]:px-0 data-[focused]:data-[placeholder]:text-foreground data-[focused]:text-foreground data-[invalid]:data-[focused]:data-[placeholder]:text-destructive-foreground data-[invalid]:data-[focused]:text-destructive-foreground data-[invalid]:data-[placeholder]:text-destructive data-[invalid]:text-destructive data-[placeholder]:text-muted-foreground/70 data-[type=literal]:text-muted-foreground/70 data-[disabled]:opacity-50",
                  isInvalid
                    ? "data-[focused]:bg-destructive/20 data-[focused]:data-[placeholder]:text-destructive-foreground data-[focused]:text-destructive-foreground data-[placeholder]:text-destructive text-destructive"
                    : ""
                )}
              />
            )}
          </DateInput>
          {!isInvalid && (
            <p className="mt-1 text-xs text-muted-foreground leading-none">
              MM / DD / YYYY
            </p>
          )}
          <div className="absolute top-1.5 right-1.5 flex items-center">
            {clearable && date && (
              <button
                type="button"
                className="outline-none focus-visible:ring-1 focus-visible:bg-muted focus-visible:ring-ring/50 p-1 rounded hover:bg-accent"
                onClick={() => {
                  setDateInput(null);
                  _setValue(null);
                  onChange?.(null);
                }}
              >
                <X className="size-4" />
              </button>
            )}
            <Popover>
              <PopoverTrigger className="outline-none focus-visible:bg-primary/20 p-1 rounded hover:bg-primary/20 cursor-pointer">
                <CalendarIcon className="w-4 h-4" />
              </PopoverTrigger>
              <PopoverContent align="end" className="p-0 w-full">
                <Calendar
                  mode="single"
                  initialFocus
                  selected={date ?? undefined}
                  onSelect={(v) => {
                    if (onChange) {
                      const previousValue = value;
                      const newValue = v;

                      if (previousValue) {
                        newValue?.setHours(previousValue.getHours());
                        newValue?.setMinutes(previousValue.getMinutes());
                        newValue?.setSeconds(previousValue.getSeconds());
                        newValue?.setMilliseconds(0);
                      }

                      onChange(newValue);
                    } else {
                      const previousValue = _value;
                      const newValue = v;

                      if (previousValue) {
                        newValue?.setHours(previousValue.getHours());
                        newValue?.setMinutes(previousValue.getMinutes());
                        newValue?.setSeconds(previousValue.getSeconds());
                        newValue?.setMilliseconds(0);
                      }
                      _setValue(newValue);
                    }
                    if (v) {
                      setDateInput(convertDateToDateValue(v));
                    } else {
                      setDateInput(undefined);
                    }
                  }}
                  defaultMonth={date ?? undefined}
                  fromDate={minValue ? minValue : undefined}
                  toDate={maxValue ? maxValue : undefined}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </DateField>
    </>
  );
}

function convertDateValueToDate(dateValue: DateValue): Date {
  // return new Date(dateValue.year, dateValue.month - 1, dateValue.day);
  const date = dateValue.toDate(getLocalTimeZone());
  return setMilliseconds(date, 0);
}

function convertDateToDateValue(date: Date): DateValue {
  let value: DateValue = now(getLocalTimeZone());
  try {
    value = parseAbsolute(date.toISOString(), getLocalTimeZone());
    return value;
  } catch {
    try {
      value = parseDateTime(date.toISOString());
      return value;
    } catch {
      // etc.
    }
  }
  return value;
}
