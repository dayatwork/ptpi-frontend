import { useMutation } from "@tanstack/react-query";
import { bookConsultation } from "./consultation.api";
import { toast } from "sonner";
import { invalidateEventQuery } from "../event/event.query";
import { invalidateConsultationSchedulesQuery } from "./consultation.query";

interface BookConsultationProps {
  onError?: (error: Error) => void;
  onSuccess?: (data: Awaited<ReturnType<typeof bookConsultation>>) => void;
  eventId: string;
}

export const useBookConsultationMutation = (props: BookConsultationProps) =>
  useMutation({
    mutationFn: bookConsultation,
    onSuccess: (data) => {
      toast.success(`Consultation booked!`);
      invalidateEventQuery(props.eventId);
      invalidateConsultationSchedulesQuery();
      props?.onSuccess?.(data);
    },
    onError: (error) => {
      toast.error(`Failed to book consultation. ${error.message}`);
      props.onError?.(error);
    },
  });
