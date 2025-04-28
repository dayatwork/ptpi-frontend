import React from "react";
import { z } from "zod";
import { useAppForm } from "@/components/form";
import { Event } from "@/modules/admin/event/event";
import { Button } from "@/components/ui/button";
import { ArchiveRestore, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Consultation } from "../../consultation";
import { useCreateConsultationSlotMutation } from "../../consultation.mutation";
import { FormErrors } from "@/components/form/form-errors";

// Slot type
interface Slot {
  startTime: string;
  endTime: string;
  deleted: boolean;
}

// Zod schema
const formSchema = z.object({
  start: z.coerce.date(),
  end: z.coerce.date(),
  duration: z.coerce.number().min(1, "Must be at least 1 minute"),
  gap: z.coerce.number().min(0, "Cannot be negative"),
});

export function CreateConsultationSlotForm({
  onSuccess,
  consultation,
}: {
  onSuccess?: () => void;
  onCancel?: () => void;
  consultation: Consultation & { event: Event };
}) {
  const [formError, setFormError] = React.useState("");
  const [slots, setSlots] = React.useState<Slot[]>([]);
  const createConsultationSlotMutation = useCreateConsultationSlotMutation({
    onError: (error) => setFormError(error.message),
    onSuccess: () => {
      onSuccess?.();
    },
  });

  const form = useAppForm({
    defaultValues: {
      start: new Date(consultation.event.startDate),
      end: new Date(consultation.event.endDate),
      duration: 30,
      gap: 0,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const generated = generateSlots(value);
      if (generated.length === 0) {
        alert("No slots generated. Check your settings.");
        return;
      }
      setSlots(generated);
    },
  });

  const toggleDeletedSlot = (startTime: string) => {
    setSlots((prev) =>
      prev.map((slot) => {
        if (slot.startTime === startTime) {
          return { ...slot, deleted: !slot.deleted };
        }
        return slot;
      })
    );
  };

  const handleSubmitSlots = async () => {
    if (slots.length === 0) {
      alert("No slots to submit.");
      return;
    }
    await createConsultationSlotMutation.mutateAsync({
      consultationId: consultation.id,
      slots: slots
        .filter((slot) => !slot.deleted)
        .map((slot) => ({
          startTime: new Date(slot.startTime),
          endTime: new Date(slot.endTime),
        })),
    });
  };

  return (
    <div className="flex gap-6 items-start max-w-7xl w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-4 w-[250px] shrink-0"
      >
        <FormErrors error={formError} />
        <form.AppField
          name="start"
          children={(field) => (
            <field.DateInputField
              label="Start"
              minValue={new Date(consultation.event.startDate)}
              maxValue={new Date(consultation.event.endDate)}
            />
          )}
        />
        <form.AppField
          name="end"
          children={(field) => (
            <field.DateInputField
              label="End"
              minValue={new Date(consultation.event.startDate)}
              maxValue={new Date(consultation.event.endDate)}
            />
          )}
        />
        <form.AppField
          name="duration"
          children={(field) => <field.NumberField label="Duration (minutes)" />}
        />
        <form.AppField
          name="gap"
          children={(field) => <field.NumberField label="Gap (minutes)" />}
        />

        <div className="flex gap-4">
          <Button type="submit" variant="outline">
            Generate Slots
          </Button>
        </div>
      </form>

      {slots.length > 0 && (
        <div className="p-4 border rounded-lg bg-muted">
          <h3 className="font-semibold mb-2">Generated Slots</h3>
          <ul className="flex gap-2 flex-wrap mb-4">
            {slots.map((slot) => (
              <li
                key={slot.startTime}
                className="border flex justify-between py-2 pl-3 pr-2 bg-background rounded-md gap-4"
              >
                <p
                  className={cn(
                    slot.deleted ? "text-muted-foreground line-through" : ""
                  )}
                >
                  {new Date(slot.startTime).toLocaleString("en-US", {
                    timeStyle: "short",
                    hourCycle: "h24",
                  })}{" "}
                  -{" "}
                  {new Date(slot.endTime).toLocaleString("en-US", {
                    timeStyle: "short",
                    hourCycle: "h24",
                  })}
                </p>
                <button
                  onClick={() => toggleDeletedSlot(slot.startTime)}
                  className={cn(
                    "size-6 flex items-center justify-center cursor-pointer rounded ",
                    slot.deleted ? "" : "text-red-600/80 hover:bg-red-600/20 "
                  )}
                >
                  {slot.deleted ? (
                    <ArchiveRestore className="w-4" />
                  ) : (
                    <Trash2 className="w-4" />
                  )}
                </button>
              </li>
            ))}
          </ul>
          <div className="flex justify-end">
            <Button
              type="button"
              onClick={handleSubmitSlots}
              disabled={
                slots.filter((s) => !s.deleted).length === 0 ||
                createConsultationSlotMutation.isPending
              }
            >
              {createConsultationSlotMutation.isPending
                ? "Submitting..."
                : `Submit ${slots.filter((s) => !s.deleted).length} Slots`}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function generateSlots(values: {
  start: string | Date;
  end: string | Date;
  duration: number;
  gap: number;
}): Slot[] {
  const { start, end, duration, gap } = values;

  const startDate = new Date(start);
  const endDate = new Date(end);

  const slots: Slot[] = [];
  let current = startDate;

  while (current < endDate) {
    const slotEnd = new Date(current.getTime() + duration * 60000);

    if (slotEnd > endDate) break;

    slots.push({
      startTime: current.toISOString(),
      endTime: slotEnd.toISOString(),
      deleted: false,
    });

    current = new Date(slotEnd.getTime() + gap * 60000);
  }

  return slots;
}
