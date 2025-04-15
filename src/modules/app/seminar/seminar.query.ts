import {
  type QueryClient,
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { queryClient } from "@/main";
import { getSeminarParticipations } from "./seminar.api";

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
