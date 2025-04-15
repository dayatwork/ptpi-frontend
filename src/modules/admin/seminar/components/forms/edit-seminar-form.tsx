import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useEditSeminarMutation } from "../../seminar.mutation";
import { Seminar } from "../../seminar";
import {
  EditSeminarInput,
  editSeminarSchema,
  validFormats,
} from "../../seminar.validation";
import { useAppForm } from "@/components/form";
import { FormErrors } from "@/components/form/form-errors";
import { type Event } from "@/modules/admin/event/event";
import { getTotalDays } from "@/utils/datetime";

export function EditSeminarForm({
  selectedSeminar,
  onSuccess,
  onCancel,
  event,
}: {
  selectedSeminar: Seminar;
  onSuccess: () => void;
  onCancel: () => void;
  event?: Event;
}) {
  const [formError, setFormError] = useState("");
  const editSeminarMutation = useEditSeminarMutation({
    onError: (error) => setFormError(error.message),
    onSuccess: () => {
      onSuccess();
    },
  });

  const form = useAppForm({
    defaultValues: {
      id: selectedSeminar.id,
      title: selectedSeminar.title,
      description: selectedSeminar.description,
      thumbnail: selectedSeminar.thumbnail,
      format: selectedSeminar.format,
      location: selectedSeminar.location,
      endDate: selectedSeminar.endDate
        ? new Date(selectedSeminar.endDate)
        : undefined,
      startDate: selectedSeminar.startDate
        ? new Date(selectedSeminar.startDate)
        : undefined,
      price: selectedSeminar.price,
    } as EditSeminarInput,
    validators: {
      onChange: editSeminarSchema,
    },
    onSubmit: async ({ value }) => {
      await editSeminarMutation.mutateAsync({
        ...value,
        id: selectedSeminar.id,
      });
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
          name="location"
          children={(field) => <field.TextField label="Location" />}
        />
        <form.AppField
          name="price"
          children={(field) => <field.NumberField label="Price" />}
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
        <form.AppForm>
          <form.SubmitButton
            text="Edit Seminar"
            submittingText="Editing Seminar..."
          />
        </form.AppForm>
      </div>
    </form>
  );
}
