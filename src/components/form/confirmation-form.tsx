import { useState } from "react";
import { FormErrors } from "./form-errors";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface ConfirmationFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: () => Promise<any>;
  onCancel: () => void;
  formError?: string;
  confirmationText: string;
  validConfirmInput?: string;
  actionText: string;
  actionSubmittingText: string;
  isSubmitting: boolean;
}

export function ConfirmationForm({
  onSubmit,
  formError,
  confirmationText,
  validConfirmInput,
  actionText,
  actionSubmittingText,
  onCancel,
  isSubmitting,
}: ConfirmationFormProps) {
  const [confirmText, setConfirmText] = useState("");
  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await onSubmit();
      }}
    >
      <FormErrors error={formError ?? ""} />
      <p className="py-2">{confirmationText}</p>
      <div className="grid gap-2">
        <Label>
          Type <span className="text-destructive">{validConfirmInput}</span>
          to confirm
        </Label>
        <Input
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
        />
      </div>
      <div className="flex gap-2 justify-end mt-6">
        <Button variant="ghost" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || confirmText !== validConfirmInput}
        >
          {isSubmitting ? actionSubmittingText || actionText : actionText}
        </Button>
      </div>
    </form>
  );
}
