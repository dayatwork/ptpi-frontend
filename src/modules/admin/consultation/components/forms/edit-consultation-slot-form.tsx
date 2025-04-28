import { useState } from "react";
import { ConfirmationForm } from "@/components/form/confirmation-form";
import { useEditConsultationSlotMutation } from "../../consultation.mutation";
import { ConsultationSlot } from "../../consultation";

type EditIntent =
  | "remove-participant"
  | "mark-as-available"
  | "mark-as-not-available"
  | "mark-as-done"
  | "mark-as-not-present";

type Action =
  | "cancel"
  | "done"
  | "not-present"
  | "available"
  | "not-available"
  | "remove-participant";

type ConfirmationDetailValue = {
  message: string;
  actionText: string;
  actionSubmitText: string;
  action: Action;
};

const confirmationDetail: Record<EditIntent, ConfirmationDetailValue> = {
  "mark-as-available": {
    actionSubmitText: "Marking as available...",
    actionText: "Mark as available",
    message: "Are you sure to mark this slot as available?",
    action: "available",
  },
  "mark-as-not-available": {
    actionSubmitText: "Marking as not available...",
    actionText: "Mark as not available",
    message: "Are you sure to mark this slot as not available?",
    action: "not-available",
  },
  "mark-as-done": {
    actionSubmitText: "Marking as done...",
    actionText: "Mark as done",
    message: "Are you sure to mark this slot as done?",
    action: "done",
  },
  "mark-as-not-present": {
    actionSubmitText: "Marking as not present...",
    actionText: "Mark as not present",
    message: "Are you sure to mark this slot as not present?",
    action: "not-present",
  },
  "remove-participant": {
    actionSubmitText: "Removing participant...",
    actionText: "Remove participant",
    message: "Are you sure to remove participant from this slot?",
    action: "remove-participant",
  },
};

export function EditConsultationSlotForm({
  selectedSlot,
  onSuccess,
  onCancel,
  intent,
}: {
  selectedSlot: ConsultationSlot;
  onSuccess: () => void;
  onCancel: () => void;
  intent: EditIntent;
}) {
  const [formError, setFormError] = useState("");
  const editConsultationMutation = useEditConsultationSlotMutation({
    onError: (error) => setFormError(error.message),
    onSuccess: () => {
      onSuccess();
    },
  });

  return (
    <ConfirmationForm
      formError={formError}
      confirmationText={confirmationDetail[intent].message}
      validConfirmInput={confirmationDetail[intent].action}
      isSubmitting={editConsultationMutation.isPending}
      onCancel={onCancel}
      onSubmit={() =>
        editConsultationMutation.mutateAsync({
          action: confirmationDetail[intent].action,
          consultationId: selectedSlot.consultationId,
          slotId: selectedSlot.id,
        })
      }
      actionSubmittingText={confirmationDetail[intent].actionSubmitText}
      actionText={confirmationDetail[intent].actionText}
    />
  );
}
