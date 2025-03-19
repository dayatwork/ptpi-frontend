import { useState } from "react";
import { DeleteForm } from "@/components/form/delete-form";
import { useDeleteSeminarMutation } from "../../seminar.mutation";
import { Seminar } from "../../seminar";

export function DeleteSeminarForm({
  selectedSeminar,
  onSuccess,
  onCancel,
}: {
  selectedSeminar: Seminar;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [formError, setFormError] = useState("");
  const deleteSeminarMutation = useDeleteSeminarMutation({
    onError: (error) => setFormError(error.message),
    onSuccess: () => {
      onSuccess();
    },
  });

  return (
    <DeleteForm
      formError={formError}
      confirmationText={`Are you sure to delete seminar ${selectedSeminar.title}?`}
      validConfirmInput={selectedSeminar.title}
      isSubmitting={deleteSeminarMutation.isPending}
      onCancel={onCancel}
      onSubmit={() =>
        deleteSeminarMutation.mutateAsync({
          id: selectedSeminar.id,
        })
      }
    />
  );
}
