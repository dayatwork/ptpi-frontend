import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/components/form";
import { FormErrors } from "@/components/form/form-errors";
import { useCreateInstitutionMutation } from "../../institution.mutation";

const createInstitutionSchema = z.object({
  name: z.string().min(3, "Minimum 3 characters"),
  logo: z.string().optional(),
});

type CreateInstitutionSchema = z.infer<typeof createInstitutionSchema>;

export function CreateInstitutionForm({
  onSuccess,
  onCancel,
}: {
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [formError, setFormError] = useState("");
  const createInstitutionMutation = useCreateInstitutionMutation({
    onError: (error) => setFormError(error.message),
    onSuccess: () => {
      onSuccess();
    },
  });

  const form = useAppForm({
    defaultValues: {
      name: "",
      logo: "",
    } as CreateInstitutionSchema,
    validators: {
      onSubmit: createInstitutionSchema,
    },
    onSubmit: async ({ value }) => {
      await createInstitutionMutation.mutateAsync(value);
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
        children={(field) => <field.TextField label="Label URL" />}
      />
      <div className="flex gap-2 justify-end mt-6">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <form.AppForm>
          <form.SubmitButton
            text="Create Institution"
            submittingText="Creating Institution..."
          />
        </form.AppForm>
      </div>
    </form>
  );
}
