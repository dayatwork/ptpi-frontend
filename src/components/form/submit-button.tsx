import { useStore } from "@tanstack/react-form";
import { useFormContext } from ".";
import { Button } from "../ui/button";

interface SubmitButtonProps {
  text: string;
  submittingText?: string;
  fullWidth?: boolean;
}

export function SubmitButton({
  text,
  submittingText,
  fullWidth = false,
}: SubmitButtonProps) {
  const form = useFormContext();

  const [isSubmitting, canSubmit] = useStore(form.store, (state) => [
    state.isSubmitting,
    state.canSubmit,
  ]);

  return (
    <Button
      type="submit"
      disabled={!canSubmit}
      className={fullWidth ? "w-full" : ""}
    >
      {isSubmitting ? submittingText || text : text}
    </Button>
  );
}
