import { useState } from "react";
import { ConfirmationForm } from "@/components/form/confirmation-form";
import { useEndSeminarMutation } from "../../seminar.mutation";
import { Seminar } from "../../seminar";

export function EndSeminarForm({
  selectedSeminar,
  onSuccess,
  onCancel,
}: {
  selectedSeminar: Seminar;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [formError, setFormError] = useState("");
  const endSeminarMutation = useEndSeminarMutation({
    onError: (error) => setFormError(error.message),
    onSuccess: () => {
      onSuccess();
    },
  });

  return (
    <ConfirmationForm
      formError={formError}
      confirmationText={`Are you sure to end seminar ${selectedSeminar.title}?`}
      validConfirmInput={selectedSeminar.title}
      isSubmitting={endSeminarMutation.isPending}
      onCancel={onCancel}
      onSubmit={() =>
        endSeminarMutation.mutateAsync({
          id: selectedSeminar.id,
        })
      }
      actionSubmittingText="Ending seminar..."
      actionText="Yes, end seminar"
    />
  );
}
