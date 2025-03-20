import { useState } from "react";
import { useAppForm } from "@/components/form";
import { Button } from "@/components/ui/button";
import { getDefaultDate, getTotalDays, isDateInRange } from "@/utils/datetime";
import { useCreateSeminarMutation } from "../../seminar.mutation";
import {
  CreateSeminarInput,
  createSeminarSchema,
  validFormats,
  validPricingTypes,
} from "../../seminar.validation";
import { FormErrors } from "@/components/form/form-errors";
import { type Event } from "@/modules/event/event";

export function CreateSeminarForm({
  onSuccess,
  onCancel,
  event,
}: {
  onSuccess: () => void;
  onCancel: () => void;
  event?: Event | null;
}) {
  const [formError, setFormError] = useState("");
  const createSeminarMutation = useCreateSeminarMutation({
    onError: (error) => setFormError(error.message),
    onSuccess: () => {
      onSuccess();
    },
  });

  const form = useAppForm({
    defaultValues: {
      title: "",
      description: "",
      thumbnail: "",
      startDate: event ? new Date(event.startDate) : getDefaultDate(8, 0),
      endDate: event ? new Date(event.endDate) : getDefaultDate(17, 0),
      location: "",
      format: "ONLINE",
      pricingType: "FREE",
      eventId: event?.id,
    } as CreateSeminarInput,
    validators: {
      onSubmit: createSeminarSchema,
    },
    onSubmit: async ({ value }) => {
      await createSeminarMutation.mutateAsync(value);
    },
  });

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <FormErrors error={formError} />
      <form.AppField
        name="title"
        children={(field) => <field.TextField label="Title" />}
      />
      <form.AppField
        name="description"
        children={(field) => <field.TextAreaField label="Description" />}
      />
      <form.AppField
        name="thumbnail"
        children={(field) => <field.TextField label="Thumbnail URL" />}
      />
      <div className="flex gap-2 items-start">
        <form.AppField
          name="format"
          children={(field) => (
            <field.SelectField
              label="Format"
              options={validFormats.map((format) => ({
                label: format,
                value: format,
              }))}
            />
          )}
        />
        <form.AppField
          name="pricingType"
          children={(field) => (
            <field.SelectField
              label="Pricing"
              options={validPricingTypes.map((pricingType) => ({
                label: pricingType,
                value: pricingType,
              }))}
            />
          )}
        />
        <form.AppField
          name="location"
          children={(field) => <field.TextField label="Location" />}
        />
      </div>
      <div className="grid grid-cols-2 gap-2 items-start">
        <form.AppField
          name="startDate"
          children={(field) => (
            <field.DateInputField
              label="Start Date"
              minValue={event ? new Date(event.startDate) : undefined}
              maxValue={event ? new Date(event.endDate) : undefined}
            />
          )}
        />
        <form.AppField
          name="endDate"
          children={(field) => (
            <field.DateInputField
              label="End Date"
              minValue={event ? new Date(event.startDate) : undefined}
              maxValue={event ? new Date(event.endDate) : undefined}
            />
          )}
        />
      </div>
      <form.Subscribe
        selector={(state) => [state.values.startDate, state.values.endDate]}
        children={([startDate, endDate]) => {
          const totalDays = getTotalDays({
            startDate,
            endDate,
          });
          return (
            <dl className="inline-flex gap-1 items-center text-sm border rounded-md px-3 py-1 bg-muted font-semibold">
              <dt>Total Days</dt>
              <span>:</span>
              <dd
                className={
                  totalDays < 1 || new Date(startDate) > new Date(endDate)
                    ? "text-destructive"
                    : ""
                }
              >
                {totalDays}
              </dd>
            </dl>
          );
        }}
      />
      <div className="flex gap-2 justify-end mt-6">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <form.Subscribe
          selector={(state) => ({
            startDate: state.values.startDate,
            endDate: state.values.endDate,
            canSubmit: state.canSubmit,
            isSubmitting: state.isSubmitting,
          })}
          children={({ canSubmit, endDate, isSubmitting, startDate }) => {
            const isStartDateInRange = event
              ? isDateInRange({
                  date: startDate,
                  from: event.startDate,
                  to: event.endDate,
                })
              : true;
            const isEndDateInRange = event
              ? isDateInRange({
                  date: endDate,
                  from: event.startDate,
                  to: event.endDate,
                })
              : true;
            return (
              <Button
                disabled={
                  isSubmitting ||
                  !canSubmit ||
                  !isStartDateInRange ||
                  !isEndDateInRange
                }
              >
                {isSubmitting ? "Creating Seminar..." : "Create"}
              </Button>
            );
          }}
        />
      </div>
    </form>
  );
}
