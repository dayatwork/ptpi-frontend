import { useState } from "react";
import { DeleteForm } from "@/components/form/delete-form";
import { useDeleteInstitutionMutation } from "../../institution.mutation";
import { Institution } from "../../institution";

export function DeleteInstitutionForm({
  selectedInstitution,
  onSuccess,
  onCancel,
}: {
  selectedInstitution: Institution;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [formError, setFormError] = useState("");
  const deleteInstitutionMutation = useDeleteInstitutionMutation({
    onError: (error) => setFormError(error.message),
    onSuccess: () => {
      onSuccess();
    },
  });

  return (
    <DeleteForm
      confirmationText={`Are you sure to delete institution "${selectedInstitution.name}"?`}
      validConfirmInput={selectedInstitution.name}
      formError={formError}
      isSubmitting={deleteInstitutionMutation.isPending}
      onCancel={onCancel}
      onSubmit={() =>
        deleteInstitutionMutation.mutateAsync({
          id: selectedInstitution.id,
        })
      }
    />
  );
}
