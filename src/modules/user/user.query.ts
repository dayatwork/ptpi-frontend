import {
  type QueryClient,
  queryOptions,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { listUsers } from "./user.api";

export const USERS_KEY = "users";

export const listUsersQueryOptions = queryOptions({
  queryKey: [USERS_KEY],
  queryFn: listUsers,
});

export const useUsers = () => {
  return useSuspenseQuery(listUsersQueryOptions);
};

export const ensureUsersData = (queryClient: QueryClient) =>
  queryClient.ensureQueryData(listUsersQueryOptions);
