import { useState } from "react";
import { DeleteForm } from "@/components/form/delete-form";
import { useDeleteEventMutation } from "../../event.mutation";
import { Event } from "../../event";

export function DeleteEventForm({
  selectedEvent,
  onSuccess,
  onCancel,
}: {
  selectedEvent: Event;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [formError, setFormError] = useState("");
  const deleteEventMutation = useDeleteEventMutation({
    onError: (error) => setFormError(error.message),
    onSuccess: () => {
      onSuccess();
    },
  });

  return (
    <DeleteForm
      confirmationText={`Are you sure to delete event ${selectedEvent.title}?`}
      validConfirmInput={selectedEvent.title}
      formError={formError}
      isSubmitting={deleteEventMutation.isPending}
      onCancel={onCancel}
      onSubmit={() =>
        deleteEventMutation.mutateAsync({
          id: selectedEvent.id,
        })
      }
    />
  );
}
