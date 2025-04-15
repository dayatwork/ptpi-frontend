import {
  type QueryClient,
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { listSeminars, getSeminar } from "./seminar.api";
import { queryClient } from "@/main";

export const SEMINARS_KEY = "admin-seminars";

export const listSeminarsQueryOptions = queryOptions({
  queryKey: [SEMINARS_KEY],
  queryFn: listSeminars,
});

export const useSuspenseSeminars = () => {
  return useSuspenseQuery(listSeminarsQueryOptions);
};

export const ensureSeminarsData = (queryClient: QueryClient) =>
  queryClient.ensureQueryData(listSeminarsQueryOptions);

export const invalidateSeminarsQuery = () =>
  queryClient.invalidateQueries({ queryKey: [SEMINARS_KEY] });

export const getSeminarQueryOptions = ({ id }: { id: string }) =>
  queryOptions({
    queryKey: [SEMINARS_KEY, { id }],
    queryFn: () => getSeminar({ id }),
  });

export const useSuspenseSeminar = ({ id }: { id: string }) => {
  return useSuspenseQuery(getSeminarQueryOptions({ id }));
};
export const useSeminar = ({ id }: { id: string }) => {
  return useQuery(getSeminarQueryOptions({ id }));
};

export const ensureSeminarData = (
  { id }: { id: string },
  queryClient: QueryClient
) => queryClient.ensureQueryData(getSeminarQueryOptions({ id }));

export const invalidateSeminarQuery = ({ id }: { id: string }) =>
  queryClient.invalidateQueries({ queryKey: [SEMINARS_KEY, { id }] });
