import {
  QueryClient,
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { queryClient } from "@/main";
import { listRooms } from "./room.api";

export const ROOMS_KEY = "admin-rooms";

export const listsRoomsQueryOptions = queryOptions({
  queryKey: [ROOMS_KEY],
  queryFn: listRooms,
});

export const useRooms = () => {
  return useQuery(listsRoomsQueryOptions);
};

export const useSuspenseRooms = () => {
  return useSuspenseQuery(listsRoomsQueryOptions);
};

export const ensureRoomsData = (queryClient: QueryClient) =>
  queryClient.ensureQueryData(listsRoomsQueryOptions);

export const invalidateRoomsQuery = () =>
  queryClient.invalidateQueries({ queryKey: [ROOMS_KEY] });
