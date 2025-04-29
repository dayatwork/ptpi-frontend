import {
  type QueryClient,
  queryOptions,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { listConsultationSchedules } from "./consultation.api";
import { queryClient } from "@/main";

export const CONSULTATION_SCHEDULES_KEY = "consultation-schedules";

export const listConsultationSchedulesQuery = queryOptions({
  queryKey: [CONSULTATION_SCHEDULES_KEY],
  queryFn: listConsultationSchedules,
});

export const ensureConsultationSchedulesData = (queryClient: QueryClient) =>
  queryClient.ensureQueryData(listConsultationSchedulesQuery);

export const useSuspenseConsultationSchedules = () => {
  return useSuspenseQuery(listConsultationSchedulesQuery);
};

export const invalidateConsultationSchedulesQuery = () =>
  queryClient.invalidateQueries({ queryKey: [CONSULTATION_SCHEDULES_KEY] });
