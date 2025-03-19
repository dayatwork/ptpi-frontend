import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { createSeminar, editSeminar, deleteSeminar } from "./seminar.api";
import {
  invalidateSeminarQuery,
  invalidateSeminarsQuery,
} from "./seminar.query";
import { invalidateEventQuery } from "../event/event.query";

interface CreateProps {
  onError?: (error: Error) => void;
  onSuccess?: (data: Awaited<ReturnType<typeof createSeminar>>) => void;
}

export const useCreateSeminarMutation = (props?: CreateProps) =>
  useMutation({
    mutationFn: createSeminar,
    onSuccess: (data) => {
      toast.success(`New seminar "${data.title}" created`);
      invalidateSeminarsQuery();
      if (data.eventId) {
        invalidateEventQuery(data.eventId);
      }
      props?.onSuccess?.(data);
    },
    onError: (error) => {
      toast.error(`Failed to create new seminar. ${error.message}`);
      props?.onError?.(error);
    },
  });

interface EditProps {
  onError?: (error: Error) => void;
  onSuccess?: (data: Awaited<ReturnType<typeof editSeminar>>) => void;
}

export const useEditSeminarMutation = (props?: EditProps) =>
  useMutation({
    mutationFn: editSeminar,
    onSuccess: (data) => {
      toast.success(`Seminar "${data.title}" edited`);
      invalidateSeminarsQuery();
      invalidateSeminarQuery({ id: data.id });
      props?.onSuccess?.(data);
    },
    onError: (error) => {
      toast.error(`Failed to edit seminar. ${error.message}`);
      props?.onError?.(error);
    },
  });

interface DeleteProps {
  onError?: (error: Error) => void;
  onSuccess?: (data: Awaited<ReturnType<typeof deleteSeminar>>) => void;
}

export const useDeleteSeminarMutation = (props?: DeleteProps) =>
  useMutation({
    mutationFn: deleteSeminar,
    onSuccess: (data) => {
      toast.success(`Seminar "${data.title}" deleted`);
      invalidateSeminarsQuery();
      invalidateSeminarQuery({ id: data.id });
      props?.onSuccess?.(data);
    },
    onError: (error) => {
      toast.error(`Failed to delete seminar. ${error.message}`);
      props?.onError?.(error);
    },
  });
