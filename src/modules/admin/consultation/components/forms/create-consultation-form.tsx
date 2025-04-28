import { useState } from "react";
import { type Event } from "@/modules/admin/event/event";
import { FormErrors } from "@/components/form/form-errors";
import { Label } from "@/components/ui/label";
import { AsyncSelectInstitution } from "@/components/async-select/async-select-institution";
import { FieldErrors } from "@/components/form/field-errors";
import { Button } from "@/components/ui/button";
import { useCreateConsultationMutation } from "../../consultation.mutation";
import { useAppForm } from "@/components/form";
import {
  CreateConsultationInput,
  createConsultationSchema,
} from "../../consultation.validation";

export function CreateConsultationForm({
  onSuccess,
  onCancel,
  event,
}: {
  onSuccess: () => void;
  onCancel: () => void;
  event: Event;
}) {
  const [formError, setFormError] = useState("");
  const createConsultationMutation = useCreateConsultationMutation({
    onError: (error) => setFormError(error.message),
    onSuccess: () => {
      onSuccess();
    },
  });
  const form = useAppForm({
    defaultValues: {
      eventId: event.id,
      exhibitorId: "",
    } as CreateConsultationInput,
    validators: {
      onSubmit: createConsultationSchema,
    },
    onSubmit: async ({ value }) => {
      await createConsultationMutation.mutateAsync(value);
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
        name="exhibitorId"
        children={(field) => (
          <div className="grid gap-2">
            <Label>Insitution</Label>
            <AsyncSelectInstitution
              selectedInstitutionId={field.state.value}
              setSelectedInstitutionId={field.handleChange}
            />
            <FieldErrors meta={field.state.meta} />
          </div>
        )}
      />
      <div className="flex gap-2 justify-end mt-6">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <form.AppForm>
          <form.SubmitButton text="Create" submittingText="Creating..." />
        </form.AppForm>
      </div>
    </form>
  );
}
