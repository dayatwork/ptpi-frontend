import { useState } from "react";
import { ConfirmationForm } from "@/components/form/confirmation-form";
import { useCancelSeminarMutation } from "../../seminar.mutation";
import { Seminar } from "../../seminar";

export function CancelSeminarForm({
  selectedSeminar,
  onSuccess,
  onCancel,
}: {
  selectedSeminar: Seminar;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [formError, setFormError] = useState("");
  const cancelSeminarMutation = useCancelSeminarMutation({
    onError: (error) => setFormError(error.message),
    onSuccess: () => {
      onSuccess();
    },
  });

  return (
    <ConfirmationForm
      formError={formError}
      confirmationText={`Are you sure to cancel seminar ${selectedSeminar.title}?`}
      validConfirmInput={selectedSeminar.title}
      isSubmitting={cancelSeminarMutation.isPending}
      onCancel={onCancel}
      onSubmit={() =>
        cancelSeminarMutation.mutateAsync({
          id: selectedSeminar.id,
        })
      }
      actionSubmittingText="Cancelling seminar..."
      actionText="Yes, cancel seminar"
    />
  );
}
