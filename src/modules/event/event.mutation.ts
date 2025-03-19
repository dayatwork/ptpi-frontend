import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryClient } from "@/main";
import { createEvent, editEvent, deleteEvent } from "./event.api";
import { EVENTS_KEY } from "./event.query";

interface CreateProps {
  onError?: (error: Error) => void;
  onSuccess?: (data: Awaited<ReturnType<typeof createEvent>>) => void;
}

export const useCreateEventMutation = (props?: CreateProps) =>
  useMutation({
    mutationFn: createEvent,
    onSuccess: (data) => {
      toast.success(`New event "${data.title}" created`);
      queryClient.invalidateQueries({ queryKey: [EVENTS_KEY] });
      props?.onSuccess?.(data);
    },
    onError: (error) => {
      toast.error(`Failed to create new event. ${error.message}`);
      props?.onError?.(error);
    },
  });

interface EditProps {
  onError?: (error: Error) => void;
  onSuccess?: (data: Awaited<ReturnType<typeof editEvent>>) => void;
}

export const useEditEventMutation = (props?: EditProps) =>
  useMutation({
    mutationFn: editEvent,
    onSuccess: (data) => {
      toast.success(`Event "${data.title}" edited`);
      queryClient.invalidateQueries({ queryKey: [EVENTS_KEY] });
      queryClient.invalidateQueries({ queryKey: [EVENTS_KEY, data.id] });
      props?.onSuccess?.(data);
    },
    onError: (error) => {
      toast.error(`Failed to edit event. ${error.message}`);
      props?.onError?.(error);
    },
  });

interface DeleteProps {
  onError?: (error: Error) => void;
  onSuccess?: (data: Awaited<ReturnType<typeof deleteEvent>>) => void;
}

export const useDeleteEventMutation = (props?: DeleteProps) =>
  useMutation({
    mutationFn: deleteEvent,
    onSuccess: (data) => {
      toast.success(`Event "${data.title}" deleted`);
      queryClient.invalidateQueries({ queryKey: [EVENTS_KEY] });
      queryClient.invalidateQueries({ queryKey: [EVENTS_KEY, data.id] });
      props?.onSuccess?.(data);
    },
    onError: (error) => {
      toast.error(`Failed to delete event. ${error.message}`);
      props?.onError?.(error);
    },
  });
