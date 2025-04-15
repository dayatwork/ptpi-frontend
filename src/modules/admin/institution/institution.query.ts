import {
  type QueryClient,
  queryOptions,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { listInstitutions, getInstitution } from "./institution.api";

export const INSTITUTIONS_KEY = "admin-institutions";

export const listInstitutionsQueryOptions = queryOptions({
  queryKey: [INSTITUTIONS_KEY],
  queryFn: listInstitutions,
});

export const useInstitutions = () => {
  return useSuspenseQuery(listInstitutionsQueryOptions);
};

export const ensureInstitutionsData = (queryClient: QueryClient) =>
  queryClient.ensureQueryData(listInstitutionsQueryOptions);

export const getInstitutionQueryOptions = ({ id }: { id: string }) =>
  queryOptions({
    queryKey: [INSTITUTIONS_KEY, { id }],
    queryFn: () => getInstitution({ id }),
  });

export const useInstitution = ({ id }: { id: string }) => {
  return useSuspenseQuery(getInstitutionQueryOptions({ id }));
};

export const ensureInstitutionData = (
  { id }: { id: string },
  queryClient: QueryClient
) => queryClient.ensureQueryData(getInstitutionQueryOptions({ id }));
