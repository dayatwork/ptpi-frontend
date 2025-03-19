import {
  QueryClient,
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { getUserSession, listPasskeys, listSessions } from "./auth.service";
import { queryClient } from "@/main";

// =============================
// ======= USER SESSION ========
// =============================
export const USER_SESSION_KEY = "user-session";

export const getUserSessionQueryOptions = queryOptions({
  queryKey: [USER_SESSION_KEY],
  queryFn: getUserSession,
  staleTime: 1000 * 60 * 5,
});

export const useUserSession = () => {
  return useQuery(getUserSessionQueryOptions);
};

export const useSuspenseUserSession = () => {
  return useSuspenseQuery(getUserSessionQueryOptions);
};

export const ensureUserSessionData = (queryClient: QueryClient) =>
  queryClient.ensureQueryData(getUserSessionQueryOptions);

export const invalidateUserSession = () =>
  queryClient.invalidateQueries({
    queryKey: [USER_SESSION_KEY],
  });

// =============================
// ======= LIST SESSIONS =======
// =============================
export const LIST_SESSIONS_KEY = "list-sessions";

export const listSessionsQueryOptions = queryOptions({
  queryKey: [LIST_SESSIONS_KEY],
  queryFn: listSessions,
  staleTime: 1000 * 60 * 5,
});

export const useListSessions = () => {
  return useQuery(listSessionsQueryOptions);
};

export const useSuspenseListSessions = () => {
  return useSuspenseQuery(listSessionsQueryOptions);
};

export const ensureListSessionsData = (queryClient: QueryClient) =>
  queryClient.ensureQueryData(listSessionsQueryOptions);

export const invalidateListSessions = () =>
  queryClient.invalidateQueries({
    queryKey: [LIST_SESSIONS_KEY],
  });

// =============================
// ======= LIST PASSKEYS =======
// =============================
export const LIST_PASSKEYS_KEY = "list-passkeys";

export const listPasskeysQueryOptions = queryOptions({
  queryKey: [LIST_PASSKEYS_KEY],
  queryFn: listPasskeys,
  staleTime: 1000 * 60 * 5,
});

export const useListPasskeys = () => {
  return useQuery(listPasskeysQueryOptions);
};

export const useSuspenseListPasskeys = () => {
  return useSuspenseQuery(listPasskeysQueryOptions);
};

export const ensureListPasskeysData = (queryClient: QueryClient) =>
  queryClient.ensureQueryData(listPasskeysQueryOptions);

export const invalidateListPasskeys = () =>
  queryClient.invalidateQueries({
    queryKey: [LIST_PASSKEYS_KEY],
  });
