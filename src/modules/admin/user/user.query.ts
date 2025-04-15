import {
  type QueryClient,
  queryOptions,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { listUsers, ListUsersProps } from "./user.api";

export const USERS_KEY = "admin-users";

export const listUsersQueryOptions = (props?: ListUsersProps) =>
  queryOptions({
    queryKey: [USERS_KEY],
    queryFn: () => listUsers(props),
  });

export const useUsers = (props?: ListUsersProps) => {
  return useSuspenseQuery(listUsersQueryOptions(props));
};

export const ensureUsersData = (
  queryClient: QueryClient,
  props?: ListUsersProps
) => queryClient.ensureQueryData(listUsersQueryOptions(props));
