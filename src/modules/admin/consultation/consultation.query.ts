import {
  type QueryClient,
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { getConsultation, listConsultations } from "./consultation.api";
import { queryClient } from "@/main";

export const ADMIN_CONSULTATIONS_KEY = "admin-consultations";

export const listConsultationsQueryOptions = (eventId: string) =>
  queryOptions({
    queryKey: [ADMIN_CONSULTATIONS_KEY, eventId],
    queryFn: () => listConsultations({ eventId }),
  });

export const useSuspenseConsultations = (eventId: string) => {
  return useSuspenseQuery(listConsultationsQueryOptions(eventId));
};

export const ensureConsultationsData = (
  eventId: string,
  queryClient: QueryClient
) => queryClient.ensureQueryData(listConsultationsQueryOptions(eventId));

export const invalidateConsultationsQuery = (eventId: string) =>
  queryClient.invalidateQueries({
    queryKey: [ADMIN_CONSULTATIONS_KEY, eventId],
  });

export const getConsultationQueryOptions = ({ id }: { id: string }) =>
  queryOptions({
    queryKey: [ADMIN_CONSULTATIONS_KEY, { id }],
    queryFn: () => getConsultation({ id }),
  });

export const useSuspenseConsultation = ({ id }: { id: string }) => {
  return useSuspenseQuery(getConsultationQueryOptions({ id }));
};

export const useConsultation = ({ id }: { id: string }) => {
  return useQuery(getConsultationQueryOptions({ id }));
};

export const ensureConsultationData = (
  { id }: { id: string },
  queryClient: QueryClient
) => queryClient.ensureQueryData(getConsultationQueryOptions({ id }));

export const invalidateConsultationQuery = ({ id }: { id: string }) =>
  queryClient.invalidateQueries({
    queryKey: [ADMIN_CONSULTATIONS_KEY, { id }],
  });
