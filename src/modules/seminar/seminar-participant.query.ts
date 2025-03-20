import {
  type QueryClient,
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { queryClient } from "@/main";
import { listSeminarParticipants } from "./seminar-participant.api";

export const SEMINAR_PARTICIPANTS_KEY = "seminar-participants";

export const listSeminarParticipantsQueryOptions = ({
  seminarId,
}: {
  seminarId: string;
}) =>
  queryOptions({
    queryKey: [SEMINAR_PARTICIPANTS_KEY, { seminarId }],
    queryFn: () => listSeminarParticipants({ seminarId }),
  });

export const useSeminarParticipants = ({
  seminarId,
}: {
  seminarId: string;
}) => {
  return useQuery(listSeminarParticipantsQueryOptions({ seminarId }));
};

export const useSuspenseSeminarParticipants = ({
  seminarId,
}: {
  seminarId: string;
}) => {
  return useSuspenseQuery(listSeminarParticipantsQueryOptions({ seminarId }));
};

export const ensureSeminarParticipantsData = (
  queryClient: QueryClient,
  { seminarId }: { seminarId: string }
) =>
  queryClient.ensureQueryData(
    listSeminarParticipantsQueryOptions({ seminarId })
  );

export const invalidateSeminarParticipantsQuery = ({
  seminarId,
}: {
  seminarId: string;
}) =>
  queryClient.invalidateQueries({
    queryKey: [SEMINAR_PARTICIPANTS_KEY, { seminarId }],
  });
