import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  bookConsultation,
  createConsultation,
  createConsultationSlot,
  deleteConsulationSlot,
  editConsultationSlot,
} from "./consultation.api";
import {
  invalidateConsultationQuery,
  invalidateConsultationsQuery,
} from "./consultation.query";
import { invalidateEventQuery } from "../event/event.query";

interface CreateConsultationProps {
  onError?: (error: Error) => void;
  onSuccess?: (data: Awaited<ReturnType<typeof createConsultation>>) => void;
}

export const useCreateConsultationMutation = (
  props?: CreateConsultationProps
) =>
  useMutation({
    mutationFn: createConsultation,
    onSuccess: (data) => {
      toast.success(`New consultation created`);
      invalidateConsultationsQuery(data.eventId);
      invalidateEventQuery(data.eventId);
      props?.onSuccess?.(data);
    },
    onError: (error) => {
      toast.error(`Failed to create new consultation. ${error.message}`);
      props?.onError?.(error);
    },
  });

interface CreateConsultationSlotProps {
  onError?: (error: Error) => void;
  onSuccess?: (
    data: Awaited<ReturnType<typeof createConsultationSlot>>
  ) => void;
}

export const useCreateConsultationSlotMutation = (
  props?: CreateConsultationSlotProps
) =>
  useMutation({
    mutationFn: createConsultationSlot,
    onSuccess: (data) => {
      toast.success(`${data.totalSlotCreated} slots created!`);
      invalidateConsultationQuery({ id: data.consultation.id });
      props?.onSuccess?.(data);
    },
    onError: (error) => {
      toast.error(`Failed to create consultation slots. ${error.message}`);
      props?.onError?.(error);
    },
  });

interface BookConsultationProps {
  onError?: (error: Error) => void;
  onSuccess?: (data: Awaited<ReturnType<typeof bookConsultation>>) => void;
}

export const useBookConsultationMutation = (props?: BookConsultationProps) =>
  useMutation({
    mutationFn: bookConsultation,
    onSuccess: (data) => {
      toast.success(`Consultation booked!`);
      invalidateConsultationQuery({ id: data.consultationId });
      props?.onSuccess?.(data);
    },
    onError: (error) => {
      toast.error(`Failed to book consultation. ${error.message}`);
      props?.onError?.(error);
    },
  });

interface DeleteConsultationSlotProps {
  onError?: (error: Error) => void;
  onSuccess?: (data: Awaited<ReturnType<typeof bookConsultation>>) => void;
}

export const useDeleteConsultationSlotMutation = (
  props?: DeleteConsultationSlotProps
) =>
  useMutation({
    mutationFn: deleteConsulationSlot,
    onSuccess: (data) => {
      toast.success(`Consultation slot deleted!`);
      invalidateConsultationQuery({ id: data.id });
      props?.onSuccess?.(data);
    },
    onError: (error) => {
      toast.error(`Failed to delete consultation slot. ${error.message}`);
      props?.onError?.(error);
    },
  });

interface EditConsultationSlotProps {
  onError?: (error: Error) => void;
  onSuccess?: (data: Awaited<ReturnType<typeof editConsultationSlot>>) => void;
}

export const useEditConsultationSlotMutation = (
  props?: EditConsultationSlotProps
) =>
  useMutation({
    mutationFn: editConsultationSlot,
    onSuccess: (data, { action }) => {
      let message = "";
      if (action === "available") message = "Slot marked as 'AVAILABLE'";
      if (action === "cancel") message = "Slot marked as 'CANCELED'";
      if (action === "done") message = "Slot marked as 'DONE'";
      if (action === "not-available")
        message = "Slot marked as 'NOT_AVAILABLE'";
      if (action === "not-present") message = "Slot marked as 'NOT_PRESENT'";
      if (action === "remove-participant")
        message = "Participant remove from slot";
      toast.success(message);
      console.log({ data });
      invalidateConsultationQuery({ id: data.consultationId });
      props?.onSuccess?.(data);
    },
    onError: (error, { action }) => {
      toast.error(`Failed to perform action '${action}'. ${error.message}`);
      props?.onError?.(error);
    },
  });
