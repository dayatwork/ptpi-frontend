import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCreateEventMutation } from "../../event.mutation";
import {
  CreateEventInput,
  createEventSchema,
  validFormats,
} from "../../event.validation";
import { getDefaultDate } from "@/utils/datetime";
import { useAppForm } from "@/components/form";
import { FormErrors } from "@/components/form/form-errors";

export function CreateEventForm({
  onSuccess,
  onCancel,
}: {
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [formError, setFormError] = useState("");
  const createEventMutation = useCreateEventMutation({
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
      startDate: getDefaultDate(8, 0),
      endDate: getDefaultDate(17, 0),
      location: "",
      format: "ONLINE",
    } as CreateEventInput,
    validators: {
      onSubmit: createEventSchema,
    },
    onSubmit: async ({ value }) => {
      await createEventMutation.mutateAsync(value);
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
            text="Create Event"
            submittingText="Creating Event..."
          />
        </form.AppForm>
      </div>
    </form>
  );
}
