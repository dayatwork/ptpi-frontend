import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { registerSeminarParticipant } from "./seminar-participant.api";
import { invalidateSeminarParticipantsQuery } from "./seminar-participant.query";

interface RegisterParticipantProps {
  onError?: (error: Error) => void;
  onSuccess?: (
    data: Awaited<ReturnType<typeof registerSeminarParticipant>>
  ) => void;
}

export const useRegisterSeminarParticipantMutation = (
  props?: RegisterParticipantProps
) =>
  useMutation({
    mutationFn: registerSeminarParticipant,
    onSuccess: (data) => {
      toast.success(`New participant "${data.userName}" registered`);
      invalidateSeminarParticipantsQuery({ seminarId: data.seminarId });
      props?.onSuccess?.(data);
    },
    onError: (error) => {
      toast.error(`Failed to register new participant. ${error.message}`);
      props?.onError?.(error);
    },
  });
