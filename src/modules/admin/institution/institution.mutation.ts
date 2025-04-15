import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryClient } from "@/main";
import {
  createInstitution,
  editInstitution,
  deleteInstitution,
} from "./institution.api";
import { INSTITUTIONS_KEY } from "./institution.query";

interface CreateProps {
  onError?: (error: Error) => void;
  onSuccess?: (data: Awaited<ReturnType<typeof createInstitution>>) => void;
}

export const useCreateInstitutionMutation = (props?: CreateProps) =>
  useMutation({
    mutationFn: createInstitution,
    onSuccess: (data) => {
      toast.success(`New institution "${data.name}" created`);
      queryClient.invalidateQueries({ queryKey: [INSTITUTIONS_KEY] });
      props?.onSuccess?.(data);
    },
    onError: (error) => {
      toast.error(`Failed to create new institution. ${error.message}`);
      props?.onError?.(error);
    },
  });

interface EditProps {
  onError?: (error: Error) => void;
  onSuccess?: (data: Awaited<ReturnType<typeof editInstitution>>) => void;
}

export const useEditInstitutionMutation = (props?: EditProps) =>
  useMutation({
    mutationFn: editInstitution,
    onSuccess: (data) => {
      toast.success(`Institution "${data.name}" edited`);
      queryClient.invalidateQueries({ queryKey: [INSTITUTIONS_KEY] });
      queryClient.invalidateQueries({ queryKey: [INSTITUTIONS_KEY, data.id] });
      props?.onSuccess?.(data);
    },
    onError: (error) => {
      toast.error(`Failed to edit institution. ${error.message}`);
      props?.onError?.(error);
    },
  });

interface DeleteProps {
  onError?: (error: Error) => void;
  onSuccess?: (data: Awaited<ReturnType<typeof deleteInstitution>>) => void;
}

export const useDeleteInstitutionMutation = (props?: DeleteProps) =>
  useMutation({
    mutationFn: deleteInstitution,
    onSuccess: (data) => {
      toast.success(`Institution "${data.name}" deleted`);
      queryClient.invalidateQueries({ queryKey: [INSTITUTIONS_KEY] });
      queryClient.invalidateQueries({ queryKey: [INSTITUTIONS_KEY, data.id] });
      props?.onSuccess?.(data);
    },
    onError: (error) => {
      toast.error(`Failed to delete institution. ${error.message}`);
      props?.onError?.(error);
    },
  });
