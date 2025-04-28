import { useState } from "react";
import { useAppForm } from "@/components/form";
import { Button } from "@/components/ui/button";
import { FormErrors } from "@/components/form/form-errors";
import { useBookConsultationMutation } from "../../consultation.mutation";
import {
  BookConsultationInput,
  bookConsultationSchema,
} from "../../consultation.validation";
import { Label } from "@/components/ui/label";
import { AsyncSelectUser } from "@/components/async-select/async-select-user";
import { FieldErrors } from "@/components/form/field-errors";
import { ConsultationSlot } from "../../consultation";

export function BookConsultationForm({
  onSuccess,
  onCancel,
  selectedSlot,
}: {
  onSuccess: () => void;
  onCancel: () => void;
  selectedSlot: ConsultationSlot;
}) {
  const [formError, setFormError] = useState("");
  const registerParticipantMutation = useBookConsultationMutation({
    onError: (error) => setFormError(error.message),
    onSuccess: () => {
      onSuccess();
    },
  });

  const form = useAppForm({
    defaultValues: {
      consultationId: selectedSlot.consultationId,
      slotId: selectedSlot.id,
      participantId: "",
    } as BookConsultationInput,
    validators: {
      onSubmit: bookConsultationSchema,
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
        name="participantId"
        children={(field) => (
          <div className="grid gap-2">
            <Label>Participant</Label>
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
            text="Book slot"
            submittingText="Booking slot..."
          />
        </form.AppForm>
      </div>
    </form>
  );
}
