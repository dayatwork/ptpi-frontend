import { useState } from "react";
import { ConfirmationForm } from "@/components/form/confirmation-form";
import { useStartSeminarMutation } from "../../seminar.mutation";
import { Seminar } from "../../seminar";

export function StartSeminarForm({
  selectedSeminar,
  onSuccess,
  onCancel,
}: {
  selectedSeminar: Seminar;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [formError, setFormError] = useState("");
  const startSeminarMutation = useStartSeminarMutation({
    onError: (error) => setFormError(error.message),
    onSuccess: () => {
      onSuccess();
    },
  });

  return (
    <ConfirmationForm
      formError={formError}
      confirmationText={`Are you sure to start seminar ${selectedSeminar.title}?`}
      validConfirmInput={selectedSeminar.title}
      isSubmitting={startSeminarMutation.isPending}
      onCancel={onCancel}
      onSubmit={() =>
        startSeminarMutation.mutateAsync({
          id: selectedSeminar.id,
        })
      }
      actionSubmittingText="Starting seminar..."
      actionText="Yes, start seminar"
    />
  );
}
