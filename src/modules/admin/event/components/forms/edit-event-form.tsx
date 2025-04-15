import { useState } from "react";
import { useAppForm } from "@/components/form";
import { FormErrors } from "@/components/form/form-errors";
import { Button } from "@/components/ui/button";
import { useEditEventMutation } from "../../event.mutation";
import { Event } from "../../event";
import {
  EditEventInput,
  editEventSchema,
  validFormats,
} from "../../event.validation";

export function EditEventForm({
  selectedEvent,
  onSuccess,
  onCancel,
}: {
  selectedEvent: Event;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [formError, setFormError] = useState("");
  const editEventMutation = useEditEventMutation({
    onError: (error) => setFormError(error.message),
    onSuccess: () => {
      onSuccess();
    },
  });

  const form = useAppForm({
    defaultValues: {
      id: selectedEvent.id,
      title: selectedEvent.title,
      description: selectedEvent.description,
      thumbnail: selectedEvent.thumbnail,
      format: selectedEvent.format,
      location: selectedEvent.location,
      endDate: selectedEvent.endDate
        ? new Date(selectedEvent.endDate)
        : undefined,
      startDate: selectedEvent.startDate
        ? new Date(selectedEvent.startDate)
        : undefined,
    } as EditEventInput,
    validators: {
      onChange: editEventSchema,
    },
    onSubmit: async ({ value }) => {
      await editEventMutation.mutateAsync({
        ...value,
        id: selectedEvent.id,
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
      </div>
      <div className="grid grid-cols-2 gap-2 items-start">
        <form.AppField
          name="startDate"
          children={(field) => <field.DateInputField label="Start Date" />}
        />
        <form.AppField
          name="endDate"
          children={(field) => <field.DateInputField label="End Date" />}
        />
      </div>
      <div className="flex gap-2 justify-end mt-6">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <form.AppForm>
          <form.SubmitButton
            text="Edit Event"
            submittingText="Editing Event..."
          />
        </form.AppForm>
      </div>
    </form>
  );
}
