import { useMutation } from "@tanstack/react-query";
import { registerSeminar } from "./seminar.api";
import { toast } from "sonner";
import { invalidateSeminarParticipationsQuery } from "./seminar.query";

interface RegisterProps {
  onError?: (error: Error) => void;
  onSuccess?: (data: Awaited<ReturnType<typeof registerSeminar>>) => void;
}

export const useRegisterSeminarMutation = (props?: RegisterProps) =>
  useMutation({
    mutationFn: registerSeminar,
    onSuccess: (data) => {
      toast.success(`You have successfully registered`);
      invalidateSeminarParticipationsQuery();
      props?.onSuccess?.(data);
    },
    onError: (error) => {
      toast.error(`Failed to register. ${error.message}`);
      props?.onError?.(error);
    },
  });
