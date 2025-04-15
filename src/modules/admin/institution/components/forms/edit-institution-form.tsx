import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/components/form";
import { FormErrors } from "@/components/form/form-errors";
import { useEditInstitutionMutation } from "../../institution.mutation";
import { Institution } from "../../institution";

const editInstitutionSchema = z.object({
  name: z.string().min(3, "Minimum 3 characters"),
  logo: z.string().optional(),
});

type EditInstitutionSchema = z.infer<typeof editInstitutionSchema>;

export function EditInstitutionForm({
  selectedInstitution,
  onSuccess,
  onCancel,
}: {
  selectedInstitution: Institution;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [formError, setFormError] = useState("");
  const editInstitutionMutation = useEditInstitutionMutation({
    onError: (error) => setFormError(error.message),
    onSuccess: () => {
      onSuccess();
    },
  });

  const form = useAppForm({
    defaultValues: {
      name: selectedInstitution.name,
      logo: selectedInstitution.logo,
    } as EditInstitutionSchema,
    validators: {
      onSubmit: editInstitutionSchema,
    },
    onSubmit: async ({ value }) => {
      await editInstitutionMutation.mutateAsync({
        ...value,
        id: selectedInstitution.id,
      });
    },
  });

  return (
    <form
      id="sign-in-form"
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <FormErrors error={formError} />
      <form.AppField
        name="name"
        children={(field) => <field.TextField label="Name" />}
      />
      <form.AppField
        name="logo"
        children={(field) => <field.TextField label="Logo URL" />}
      />
      <div className="flex gap-2 justify-end mt-6">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <form.AppForm>
          <form.SubmitButton
            text="Edit Institution"
            submittingText="Editing Institution..."
          />
        </form.AppForm>
      </div>
    </form>
  );
}
