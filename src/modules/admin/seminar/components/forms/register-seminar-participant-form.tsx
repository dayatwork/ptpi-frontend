import { useState } from "react";
import { useAppForm } from "@/components/form";
import { Button } from "@/components/ui/button";
import { FormErrors } from "@/components/form/form-errors";
import { useRegisterSeminarParticipantMutation } from "../../seminar-participant.mutation";
import {
  RegisterSeminarParticipantInput,
  registerSeminarParticipantSchema,
} from "../../seminar-participant.validation";
import { Label } from "@/components/ui/label";
import { AsyncSelectUser } from "@/components/async-select/async-select-user";
import { FieldErrors } from "@/components/form/field-errors";

export function RegisterSeminarParticipantForm({
  onSuccess,
  onCancel,
  seminarId,
}: {
  onSuccess: () => void;
  onCancel: () => void;
  seminarId: string;
}) {
  const [formError, setFormError] = useState("");
  const registerParticipantMutation = useRegisterSeminarParticipantMutation({
    onError: (error) => setFormError(error.message),
    onSuccess: () => {
      onSuccess();
    },
  });

  const form = useAppForm({
    defaultValues: {
      seminarId,
      userId: "",
    } as RegisterSeminarParticipantInput,
    validators: {
      onSubmit: registerSeminarParticipantSchema,
    },
    onSubmit: async ({ value }) => {
      await registerParticipantMutation.mutateAsync(value);
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
        name="userId"
        children={(field) => (
          <div className="grid gap-2">
            <Label>User</Label>
            <AsyncSelectUser
              selectedUserId={field.state.value}
              setSelectedUserId={field.handleChange}
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
          <form.SubmitButton
            text="Register Participant"
            submittingText="Registering Participant..."
          />
        </form.AppForm>
      </div>
    </form>
  );
}
