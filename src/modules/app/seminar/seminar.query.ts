import {
  type QueryClient,
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { queryClient } from "@/main";
import { getSeminar, getSeminarParticipations } from "./seminar.api";

// ==================================
// ========= GET SEMINAR ============
// ==================================
export const SEMINAR_KEY = "seminar-details";

export const getSeminarQueryOptions = (seminarId: string) =>
  queryOptions({
    queryKey: [SEMINAR_KEY, seminarId],
    queryFn: () => getSeminar(seminarId),
    staleTime: 1000 * 60,
  });

export const useSuspenseSeminar = (seminarId: string) => {
  return useSuspenseQuery(getSeminarQueryOptions(seminarId));
};

export const useSeminar = (seminarId: string) => {
  return useQuery(getSeminarQueryOptions(seminarId));
};

export const ensureSeminarData = (
  seminarId: string,
  queryClient: QueryClient
) => queryClient.ensureQueryData(getSeminarQueryOptions(seminarId));

export const invalidateSeminarQuery = (seminarId: string) =>
  queryClient.invalidateQueries({ queryKey: [SEMINAR_KEY, seminarId] });

// ==================================
// === GET SEMINAR PARTICIPATIONS ===
// ==================================
export const SEMINAR_PARTICIPATIONS_KEY = "seminar-participations";

export const getSeminarParticipationsQueryOptions = queryOptions({
  queryKey: [SEMINAR_PARTICIPATIONS_KEY],
  queryFn: getSeminarParticipations,
  staleTime: 1000 * 60,
});

export const useSuspenseSeminarParticipations = () => {
  return useSuspenseQuery(getSeminarParticipationsQueryOptions);
};

export const useSeminarParticipations = () => {
  return useQuery(getSeminarParticipationsQueryOptions);
};

export const ensureSeminarParticipationsData = (queryClient: QueryClient) =>
  queryClient.ensureQueryData(getSeminarParticipationsQueryOptions);

export const invalidateSeminarParticipationsQuery = () =>
  queryClient.invalidateQueries({ queryKey: [SEMINAR_PARTICIPATIONS_KEY] });
